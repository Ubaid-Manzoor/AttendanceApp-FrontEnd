import React , { Component } from 'react';
import { connect } from 'react-redux';
import { getAndSetDepartments } from '../../actions/department';

import DepartmentComponent from './DepartmentComponent';

import setInputState from '../../genericFunctions/setInputState';
import handleSubmit from '../../genericFunctions/handleSubmit';
import clearMessage from '../../genericFunctions/clearMessage';


class AddDepartmentPage extends Component{
    constructor(props){
        super(props);

        this.state = {
            data: {
                name: ""
            },
            errorsExists: false,
            errors:{
                name: "",
                exists: "",
                otherError: ""
            },
            message: ""
        }
    }

    //////////////////////////  INPUT HANDLERS //////////////////////////

    onInputChange = (e)=>{
        const value = e.target.value;
        const name = e.target.id;
        setInputState.call(this,"data",name,value)
    }

    //////////////////////////  INPUT HANDLERS ENDS //////////////////////////


    ////////////////////////// ERROR HANDLER /////////////////////////////////

    setErrors = (toUpdate)=>{
        this.setState((prevState) =>{
            return {
                errors:{
                    ...prevState.errors,
                    ...toUpdate
                }
            }
        })
        this.setState({errorsExists: true});
    }

    clearAllErrors = ()=>{
        this.setErrors({
            name: "",
            exists: "",
            otherError: "",
        })
        this.setState({errorsExists: false});
    }


    applyAuthentication(){
        const data = this.state.data;
        return new Promise((resolve, reject)=>{
            if(data.name === ''){
                this.setErrors({name: "Fill the box"})
            }
            resolve();
        })
    }

    ////////////////////////// ERROR HANDLER ENDS /////////////////////////////////


    /////////////////////////  REQUEST RELATED FUNCTIONS /////////////////////////

    handleResponse = (response)=>{
        const { message , status } = response.result;

        switch(status){
            case 201:
                console.log(message)
                this.setState({
                    message
                },clearMessage.bind(this,3000))
                this.setState({message})
                this.props.setDepartments();
                break;
            case 409:
                this.setErrors({
                    exists:message
                })
                console.log(message)
                break;
            case 400:
                this.setErrors({
                    otherError: message
                })
                console.log(message)
                break;
            default:
                break
        }
    }

    onSubmit = (e)=>{
        e.preventDefault();

        const url = 'http://localhost:5000/add_department';
        handleSubmit.call(this,url);
    }


    /////////////////////////  REQUEST RELATED FUNCTIONS ENDS /////////////////////////


    componentDidMount = ()=>{
        this.props.setDepartments();
    }


    render() {
        const listOfDepartments = this.props.departments;

        return (
            <div className="MainBody department_MainBody sidePage">
                <div className="Container department_Container">
                    <div className="FormContainer department_FormContainer">
                        <header>
                            <h1>Add Department</h1>
                        </header>
                        {this.state.message && <span className="confirmationMessage">{this.state.message}</span>}
                        {this.state.errors.exists && <span className="errorMessage">{this.state.errors.exists}</span>}
                        <form onSubmit={this.onSubmit}>
                            <div>
                                <label 
                                    className="Label"
                                    htmlFor="name"
                                >
                                    Name Of Department
                                </label>
                                <div className="inputErrorDiv">
                                    <div className="inputDiv">
                                        <input
                                            type="text"
                                            id="name"
                                            placeholder=""
                                            value={this.state.data.name}
                                            onChange={this.onInputChange}
                                        />
                                    </div>
                                    {this.state.errors.name && <span className="errorMessage">{this.state.errors.name}</span>}
                                </div>
                            </div>
                            <button className="Button">
                                Add Department
                            </button>
                        </form>
                    </div>
                </div>
                    <div className="ListBlock">
                        <header>
                            <h2> All Department </h2>
                        </header>
                        <div className="MainContainer">
                            <ol>
                                {
                                    !!listOfDepartments &&
                                    listOfDepartments.map(department =>{
                                        const { name } = department; 
                                        return <li key={name}><DepartmentComponent name={name}  /></li>
                                    })
                                }
                            </ol>
                        </div>
                    </div>
            </div>
        )
    }
}

const mapStateToProps = (state)=>{
    return {
        departments: state.departments
    }
}

const mapDispatchToProps = (dispatch)=>{
    return{
        setDepartments : (filters,projection) => dispatch(getAndSetDepartments(filters,projection))
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(AddDepartmentPage);

