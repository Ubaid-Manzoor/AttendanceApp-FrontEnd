import React , { Component } from 'react';
import { connect } from 'react-redux';
import { getAndSetDepartments } from '../../actions/department';

import DepartmentComponent from './DepartmentComponent';

import  './_DepartmentPage.scss';

class DepartmentPage extends Component{
    constructor(props){
        super(props);

        this.props.setDepartments();
        this.state = {
            departmentData: {
                departmentName: ""
            },
            errorsExists: false,
            errors:{
                departmentName: "",
                departmentExists: "",
                otherError: ""
            },
            message: ""
        }
    }

    onInputChange = (e)=>{
        const value = e.target.value;
        const name = e.target.id;
        this.setState((prevState)=>{
            return {
                departmentData: {
                    ...prevState.departmentData,
                    [name]:value
                }
            }
        })
    }

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
            departmentName: "",
            departmentExists: "",
            otherError: "",
        })
        this.setState({errorsExists: false});
    }


    applyAuthentication(departmentData){
        if(departmentData.departmentName === ''){
            this.setErrors({departmentName: "Fill the box"})
        }
    }

    waitTillStateChange(callback){
        this.setState(state => state,()=>{
                callback()
            }
        )
    }


    onSubmit = (e)=>{
        e.preventDefault();

        const departmentData = this.state.departmentData;

        this.clearAllErrors();
        this.applyAuthentication(departmentData);

        this.waitTillStateChange(()=>{
            console.log(this.state)
            if(!this.state.errorsExists){
                fetch('http://localhost:5000/add_department',{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(departmentData)
                })
                .then(response => response.json())
                .then(response => {
                    const { message , status } = response.result;

                    if(response.status === 200){
                        switch(status){
                            case 201:
                                console.log(message)
                                this.setState({
                                    message
                                })
                                this.setState({message})
                                break;
                            case 409:
                                this.setErrors({
                                    departmentExists:message
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
                })
            }
        })

    }

    render() {
        const listOfDepartments = this.props.departments;
        return (
            <div className="department_MainBody sidePage">
                <div className="department_Container">
                    <div className="department_FormContainer">
                        <header>
                            <h1>Add Department</h1>
                        </header>
                        {this.state.message && <span className="confirmationMessage">{this.state.message}</span>}
                        {this.state.errors.departmentExists && <span className="errorMessage">{this.state.errors.departmentExists}</span>}
                        <form onSubmit={this.onSubmit}>
                            <div>
                                <label 
                                    className="Label"
                                    htmlFor="departmentName"
                                >
                                    Name Of Department
                                </label>
                                <div className="inputErrorDiv">
                                    <div className="inputDiv">
                                        <input
                                            type="text"
                                            id="departmentName"
                                            placeholder=""
                                            value={this.state.departmentData.departmentName}
                                            onChange={this.onInputChange}
                                        />
                                    </div>
                                    {this.state.errors.departmentName && <span className="errorMessage">{this.state.errors.departmentName}</span>}
                                </div>
                            </div>
                            <button className="Button">
                                Add Department
                            </button>
                        </form>
                    </div>
                </div>
                    <div className="teacher_ListBlock">
                        <header>
                            <h2> All Department </h2>
                        </header>
                        <div className="teacher_MainContainer">
                            <ol>
                                {
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
        setDepartments : () => dispatch(getAndSetDepartments())
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(DepartmentPage);

