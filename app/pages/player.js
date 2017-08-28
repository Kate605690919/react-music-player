import React from 'react';
import Pubsub from 'pubsub-js';
import Progress from '../Components/progress';
import './player.less';
import {Link} from 'react-router';

class Player extends React.Component{
	constructor(props) {
		super(props);
		this.progressChangeHandler = this.progressChangeHandler.bind(this);
		this.volumeChangeHandler = this.volumeChangeHandler.bind(this);
		this.play = this.play.bind(this);
		this.state={progress:0,volume:0,isPlay:true,leftTime:''};
		this.duration = null;
	}
	playPrev() {
		Pubsub.publish('PLAY_PREV');
	}
	playNext() {
		Pubsub.publish('PLAY_NEXT');
	}
	changeRepeat() {
		Pubsub.publish('CHANGE_REPEAT');
	}
	formatTime(time) {
		time = Math.floor(time);
		let minutes = Math.floor(time / 60);
		let seconds = Math.floor(time % 60);
		seconds = seconds < 10 ? `0${seconds}` : seconds;
		return `${minutes}:${seconds}`;
	}
	componentDidMount() {
		$('#player').bind($.jPlayer.event.timeupdate,(e)=>{
			this.duration = e.jPlayer.status.duration;
			this.setState({
				progress: e.jPlayer.status.currentPercentAbsolute.toFixed(2),
				volume:e.jPlayer.options.volume * 100,//本来是个0到1之间的值，为了和progress对应，所以乘了100
				leftTime: this.formatTime(this.duration * (1 - e.jPlayer.status.currentPercentAbsolute / 100))
			})
		})
	}
	componentWillUnmount() {
		$('#player').unbind('$.jPlayer.event.timeupdate');
	}
	progressChangeHandler(progress){
		$('#player').jPlayer('play',this.duration*progress);
	}
	volumeChangeHandler(volume){
		$('#player').jPlayer('volume',volume);
	}
	play(){
		if(this.state.isPlay){
			$('#player').jPlayer('pause');
		}
		else{
			$('#player').jPlayer('play');
		}
		this.setState({isPlay: !this.state.isPlay});
	}
	render(){
		return(
			<div className="pages-player">
				<h1 className="caption"><Link to="/list">Kate 的私人音乐坊 &gt;</Link></h1>
                <div className="mt20 row">
                	<div className="controll-wrapper">
                		<h2 className="music-title">{this.props.currentMusicItem.title}</h2>
                		<h3 className="music-artist mt10">{this.props.currentMusicItem.artist}</h3>
                		<div className="row mt20">
                			<div className="left-time -col-auto">{this.state.leftTime}</div>
                			<div className="volume-container">
                				<i className="icon-volume rt" style={{top: 5, left: -5}}></i>
                				<div className="volume-wrapper">
                					<Progress progress={this.state.volume} onProgressChange={this.volumeChangeHandler} barColor="#aaa"/>
                				</div>
                			</div>
                		</div>
                		<div style={{height: 10, lineHeight: '10px',marginTop:10}}>
			                <Progress progress={this.state.progress} onProgressChange={this.progressChangeHandler} />
                		</div>
                		<div className="mt35 row">
                			<div>
	                			<i className="icon prev" onClick={this.playPrev} ></i>
	                			<i className={`icon ml20 ${this.state.isPlay?'pause':'play'}`} onClick={this.play}></i>
	                			<i className="icon next ml20" onClick={this.playNext} ></i>
                			</div>
                			<div className="-col-auto">
                				<i className={`icon repeat-${this.props.repeatType}`} onClick={this.changeRepeat}></i>
                			</div>
                		</div>
                	</div>
                	<div className="-col-auto cover">
                		<img src={this.props.currentMusicItem.cover} alt={this.props.currentMusicItem.title}/>
                	</div>
                </div>
			</div>
		);
	}
}
export default Player;