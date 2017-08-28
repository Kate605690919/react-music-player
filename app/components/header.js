import React from 'react';
import { Link } from 'react-router'
import './header.less'
class Header extends React.Component{
	render(){
		return(
			<div className="components-header row">
				<img src="/static/img/logo.png" alt="logo" width="40" className="-col-auto"/>
				<h1 className="caption"><Link to="/">React Music Player</Link></h1>
			</div>
		);
	}
}
export default Header;