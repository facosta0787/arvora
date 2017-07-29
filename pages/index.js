import React, { Component } from 'react';
import tapPlugins from 'react-tap-event-plugin';
import styled from 'styled-components';
import fetch from 'isomorphic-fetch';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from '../components/AppBar';
import { List,ListItem } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import {grey400, darkBlack, lightBlack} from 'material-ui/styles/colors';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Toggle from 'material-ui/Toggle';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import AutoComplete from 'material-ui/AutoComplete';
import DatePicker from 'material-ui/DatePicker';
import ContentAdd from 'material-ui/svg-icons/content/add';
import personas from '../mocks/personas';
import linq from 'linq';
import family_api from '../services/family-api';

class home extends Component{

  constructor(props){
    super(props)
    try{tapPlugins()}catch(e){}
    this.state = {
      loading: "loading",
      content: "home",
      familiares:[],
      form_genero:null,
      form_conyuge:false,
      form_familiar:[],
      form_apellido1: '',
      form_apellido2: '',
      form_nombres: '',
      form_padre: '',
      form_dateBirth: '',
      form_death:false,
      form_dateDeath: null
    }

  }

  componentWillMount(){
  }

  async componentDidMount() {
    /*const response = await fetch(family_api.URL)
    const personas = await response.json() */
    await this.setState({familiares:await family_api.getPersons()})
    let dataPariente = await linq.from(this.state.familiares.familiares)
                      .select(function(x){ return {id:x.id,Names:x.Names + ' ' + x.lastName1 + ' ' +x.lastName2} })
                      .toArray()
    await this.setState({form_familiar: dataPariente})
    await this.setState({loading: "hide"})
  }

  handleFabClick = (e) => {
      this.setState({content: "form"})
  }

  handleFormSubmit = async (event) =>{
    event.preventDefault();

    if(this.state.form_genero != null &&
    this.state.form_padre != "" &&
    this.state.form_apellido1 != "" &&
    this.state.form_apellido2 != "" &&
    this.state.form_nombres != "" ){
      const dataPost = await {genero:this.state.form_genero,
                        conyuge: this.state.form_conyuge,
                        padre:this.state.form_padre,
                        apellido1:this.state.form_apellido1,
                        apellido2:this.state.form_apellido2,
                        nombres: this.state.form_nombres,
                        fechaNacimiento: this.state.form_dateBirth,
                        muerto:this.state.form_death,
                        fechaMuerte:this.state.form_dateDeath};

      const options = await {method: "POST",
                      headers: {
                        'Accept':'application/json; charset=utf-8',
                        'Content-Type':'application/json',
                        'X-CSRF-TOKEN':''
                      },
                      mode: 'cors',
                      body:  await JSON.stringify(dataPost) }

      const response = await fetch("http://localhost/arvora-backend/public/familiares/add",options)
      const data = await response.json()
      console.log(response)
      if(response.status == 200){
        //this.setState({content:'home'});
        location.reload()
      }
    }else{
      alert("Debe completar todos los campos")
    }
  }

  handleSelectChange = (event,index,value) => {
    this.setState({form_genero:value})
  }

  handleItemClick = (event) => {
    let pariente = parseInt(event.target.name)
    let dataPariente = linq.from(this.state.familiares.familiares)
    .where(function(x){return x.id === pariente})
    .select(function(x){ return {id:x.id,Names:x.Names + ' ' + x.lastName1 + ' ' +x.lastName2} })
    .toArray()

  }

  handleOnChangeApellido1 = (event,newValue) =>{
    this.setState({form_apellido1: newValue})
  }
  handleOnChangeApellido2 = (event,newValue) =>{
    this.setState({form_apellido2: newValue})
  }
  handleOnChangeNombres = (event,newValue) =>{
    this.setState({form_nombres: newValue})
  }

  handleToggle = (event,isInputChecked) =>{
    if(event.target.name == 'tgConyuge'){
      this.setState({form_conyuge:isInputChecked})
    }else{
      this.setState({form_death:isInputChecked})
    }

  }

  onNewRequest = (event,chosenRequest,index) =>{
    let padre = this.state.form_familiar[chosenRequest]
    if (typeof padre != 'undefined'){
      this.setState({form_padre: padre.id})
    }else{
      this.setState({form_padre: '' })
    }
  }

  handleDateChange = (event,date) => {
    this.setState({form_dateBirth: fecha(date) })

  }

  handleDateDeathChange = (event,date) => {
    this.setState({form_dateDeath: fecha(date) })

  }

  render(){

    return(
      <div>
      <AppBar title="Familia Estrada Correa"/>
      <Content>

      <MuiThemeProvider>
        <List>
        { this.state.loading == "hide" && this.state.content == "home" &&
          this.state.familiares.familiares.map(
          persona => {
            return(
              <ListItem
                key={persona.id}
                name={persona.id.toString()}
                leftAvatar={<Avatar src="static/contact.png" onTouchTap={this.handleItemClick} name={persona.id.toString()}/>}
                primaryText={<span style={{color: darkBlack}}> {persona.Names + ' ' + persona.lastName1 + ' ' + persona.lastName2} </span>}
                secondaryText={
                  <p>
                  <span style={{color: darkBlack}}>Fecha de Nacimiento: </span>
                  {persona.birthDate}
                  </p>
                }
                secondaryTextLines={1}
                style={{borderBottom: "1px solid #BDBDBD"}}

              />
            )
          }
        )}
        </List>
      </MuiThemeProvider>

      {this.state.loading == "hide" && this.state.content == "form" &&
        <form>
          <DivForm1>

          <MuiThemeProvider>
          <SelectField floatingLabelText="Genero" value={this.state.form_genero} autoWidth={true} onChange={this.handleSelectChange}
            style={{width: 160}}
          >
          <MenuItem value={1} primaryText="Hombre" />
          <MenuItem value={2} primaryText="Mujer" />
          <MenuItem value={3} primaryText="Transgenero" />
          </SelectField>
          </MuiThemeProvider>

          <MuiThemeProvider>
            <Toggle
            name='tgConyuge'
            className="child"
            label="Conyuge"
            style={{marginBottom: 0, width: 160}}
            onToggle={this.handleToggle}
            />
          </MuiThemeProvider>
          </DivForm1>
          <MuiThemeProvider>
            <AutoComplete
              floatingLabelText="Padre, Madre o Conyuge"
              filter={AutoComplete.caseInsensitiveFilter}
              dataSource={this.state.form_familiar}
              dataSourceConfig={{text:'Names',value:'id'}}
              fullWidth={true}
              onNewRequest={this.onNewRequest}
            />
          </MuiThemeProvider><br />
          <MuiThemeProvider><TextField onChange={this.handleOnChangeApellido1} floatingLabelText="Primer Apellido" style={{width: '100%'}} /></MuiThemeProvider><br />
          <MuiThemeProvider><TextField onChange={this.handleOnChangeApellido2} floatingLabelText="Segundo Apellido" style={{width: '100%'}} /></MuiThemeProvider><br />
          <MuiThemeProvider><TextField onChange={this.handleOnChangeNombres} floatingLabelText="Nombres" style={{width: '100%'}} /></MuiThemeProvider>

          <DivForm1>
            <MuiThemeProvider>
              <DatePicker
                name="dtpBirth"
                style={{marginTop: '20px'}}
                textFieldStyle={{width:'160px'}}
                hintText="Fecha de Nacimiento"
                autoOk={true}
                onChange={this.handleDateChange} />
            </MuiThemeProvider>

            <MuiThemeProvider>
              <Toggle
                className="child child2"
                label="Fallecido"
                style={{marginBottom: 0, width: 160}}
                onToggle={this.handleToggle}
              />
            </MuiThemeProvider>
          </DivForm1>

          {this.state.form_death &&
            <MuiThemeProvider>
              <DatePicker
                hintText="Fecha de Fallecido"
                textFieldStyle={{width:'160px'}}
                autoOk={true}
                onChange={this.handleDateDeathChange}/>
            </MuiThemeProvider>
          }

          <MuiThemeProvider>
            <RaisedButton
              label="GUARDAR"
              primary={true}
              style={{width: '100%',margin: '50px 0 0 0'}}
              onTouchTap={this.handleFormSubmit}
              />
          </MuiThemeProvider>
        </form>
      }

      <Refresh>
      <MuiThemeProvider>
      <RefreshIndicator
        size={40}
        left={0}
        top={0}
        style={{position: 'relative'}}
        status={this.state.loading} />
      </MuiThemeProvider>
      </Refresh>

      {this.state.content == 'home' &&
        <MuiThemeProvider>
          <FloatingButton>
            <FloatingActionButton onTouchTap={this.handleFabClick} backgroundColor='#2E7D32'>
              <ContentAdd />
            </FloatingActionButton>
          </FloatingButton>
        </MuiThemeProvider>
      }
      </Content>
      </div>
    )
  }
}
export default home

const Content = styled.div`
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  width: 70%;
  height: 200px;
  height: calc(100vh - 64px);
  margin: 64px auto 0 auto;
  @media (max-width: 800px) {
    width: 95%;
  }
`;

const FloatingButton = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  cursor: pointer;
  z-index: 1000;
`;

const Refresh = styled.div`
  width: 40px;
  height: 40px;
  margin: 0 auto 0 auto;
`;

const DivForm1 = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  .child{
    align-self: flex-end;
    padding: 0 0 12px 0;
  }
  .child2{
    margin-top:20px;
  }
`;

function fecha(date){
  let meses = ['01','02','03','04','05','06','07','08','09','10','11','12'];
  let selectDate;
  let dia = '00'+date.getDate();
  dia = dia.substring(dia.length - 2,dia.length);
  return selectDate = date.getFullYear() + '-' +meses[date.getMonth()] +'-'+dia;
}
