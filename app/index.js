import React from 'react';
import {render} from 'react-dom';
import {AppContainer} from 'react-hot-loader';//只是更新了不同的内容，而不是刷新页面（很多东西会还原）
import Root from './root';
render(
	<AppContainer>
		<Root />
	</AppContainer>,
	document.getElementById('root')
);
if(module.hot){
	module.hot.accept('./root',()=>{
		const NewRoot = require('./root').default;
		render(
			<AppContainer>
				<NewRoot />
			</AppContainer>,
			document.getElementById('root')
		);
	});
}