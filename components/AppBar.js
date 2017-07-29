import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Appbar from 'material-ui/AppBar';
import styled from 'styled-components';

class AppBar extends Component{

  render(){
    return(
      <Head>
      <MuiThemeProvider>
        <Appbar title={this.props.title} zDepth={2} showMenuIconButton={false} style={{backgroundColor:'#2E7D32'}}/>
      </MuiThemeProvider>
      </Head>
    );
  }
}
export default AppBar;

const Head = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
`;
