import React from 'react';
import './musiclistitem.less';
import Pubsub from 'pubsub-js';

class MusicListItem extends React.Component{
	constructor(props) {
		super(props);
		this.playMusic = this.playMusic.bind(this,this.props.musicItem);
		this.deleteMusic = this.deleteMusic.bind(this,this.props.musicItem);
	}

	playMusic(musicItem){
		Pubsub.publish('PLAY_MUSIC',musicItem);
	}

	deleteMusic(musicItem,e){
		e.stopPropagation();
		Pubsub.publish('DELETE_MUSIC',musicItem);
	}

	render(){
		return (
			<li onClick={this.playMusic} className={`components-musiclistitem row${this.props.focus ? ' focus' : ''}`}>
				<p><strong>{this.props.musicItem.title} </strong>- {this.props.musicItem.artist}</p>
				<p onClick={this.deleteMusic} className="-col-auto delete"></p>
			</li>
		);
	}
}
export default MusicListItem;