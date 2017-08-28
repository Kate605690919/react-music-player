import React from 'react';
import Pubsub from 'pubsub-js';
import Header from './Components/header';
import Player from './pages/player';
import MusicList from './pages/musiclist';
import { randomRange } from './utils/util';
import { MUSIC_LIST } from './config/musiclist';
import { Router,Route,Link, browserHistory,IndexRoute } from 'react-router';

class App extends React.Component{
	constructor(props) {
		super(props);
		this.state = {currentMusicItem: MUSIC_LIST[0],musicList:MUSIC_LIST}
	}
	playMusic(musicItem) {
		$('#player').jPlayer('setMedia', {
			mp3: musicItem.file
		}).jPlayer('play');
		this.setState({currentMusicItem: musicItem});
	}
	playNext(type = 'next') {
		let index = this.findMusicIndex(this.state.currentMusicItem);
		let newIndex = null;
		let musicLength = this.state.musicList.length;
		if(type === 'next') {
			newIndex = (index + 1) % musicLength;
		} else {
			newIndex = (index - 1 + musicLength) % musicLength;
		}
		this.playMusic(this.state.musicList[newIndex]);
	}
	findMusicIndex(musicItem) {
		return this.state.musicList.indexOf(musicItem);
	}
	playWhenEnd() {
		if (this.state.repeatType === 'random') {
			let index = this.findMusicIndex(this.state.currentMusicItem);
			let randomIndex = randomRange(0, this.state.musicList.length - 1);
			while(randomIndex === index) {
				randomIndex = randomRange(0, this.state.musicList.length - 1);
			}
			this.playMusic(this.state.musicList[randomIndex]);
		} else if (this.state.repeatType === 'once') {
			this.playMusic(this.state.currentMusicItem);
		} else {
			this.playNext();
		}
	}
	componentDidMount() {
		$('#player').jPlayer({
			supplied:'mp3',
			wmode:'window'
		});
		this.playMusic(this.state.currentMusicItem);
		$('#player').bind($.jPlayer.event.ended,(e)=>{
			this.playWhenEnd();
		});
		Pubsub.subscribe('DELETE_MUSIC',(msg,musicItem)=>{
			this.setState({musicList:this.state.musicList.filter(item=>{return item !== musicItem})});
		});
		Pubsub.subscribe('PLAY_MUSIC',(msg,musicItem)=>{
			this.playMusic(musicItem);
		});
		Pubsub.subscribe('PLAY_PREV',(msg)=>{
			this.playNext('prev');
		});
		Pubsub.subscribe('PLAY_NEXT',(msg,musicItem)=>{
			this.playNext();
		});
		let repeatList = ['cycle','once','random'];
		Pubsub.subscribe('CHANGE_REPEAT',()=>{
			let index = repeatList.indexOf(this.state.repeatType);
			index = (index + 1) % repeatList.length;
			this.setState({
				repeatType: repeatList[index]
			})
		});
	}
	componentWillUnmount() {
		Pubsub.unsubscribe('DELETE_MUSIC');
		Pubsub.unsubscribe('PLAY_MUSIC');
		Pubsub.unsubscribe('PLAY_PREV');
		Pubsub.unsubscribe('PLAY_NEXT');
		Pubsub.unsubscribe('CHANGE_REPEAT');
		$('#player').unbind($.jPlayer.event.ended);
	}
	render(){
		let children = this.props.children;
		return(
			<div className="root">
				<Header />
				{React.cloneElement(children, this.state)}
			</div>
		);
	}
}

class Root extends React.Component{
	render(){
		return(
			<Router history={browserHistory} >
				<Route path="/" component={App} >
					<IndexRoute component={Player}></IndexRoute>
					<Route path="/list" component={MusicList}></Route>
				</Route>
			</Router>
		);
	}
}
export default Root;
//<MusicList currentMusicItem={this.state.currentMusicItem} musicList={this.props.musicList} />