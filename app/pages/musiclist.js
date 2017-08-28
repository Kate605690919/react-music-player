import React from 'react';
import MusicListItem from '../components/musiclistitem';
import './musiclist.less';
class MusicList extends React.Component{
	render(){
		let listEls = null;
		listEls = this.props.musicList.map(item=>{
			return <MusicListItem key={item.id}  focus={item === this.props.currentMusicItem} musicItem={item} />  //如果key相同，就不重新渲染
		});
		return (
			<ul>{listEls}</ul>
		);
	}
}
export default MusicList;