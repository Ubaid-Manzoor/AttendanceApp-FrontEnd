import React , { Component } from 'react';

import  './_addCoursePage.scss';

class AddCoursePage extends Component{
    constructor(props){
        super(props);

        this.state = {
            courseData: {
                courseName: "",
                teacherAssigned: ""
            },
            errorsExists: false,
            errors:{
                courseName: "",
                teacherAssigned: "",
                courseExist: "",
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
                courseData: {
                    ...prevState.courseData,
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
            courseName: "",
            teacherAssigned: "",
            otherError: "",
            courseExist: ""
        })
        this.setState({errorsExists: false});
    }


    applyAuthentication(courseData){
        if(courseData.courseName === ''){
            this.setErrors({courseName: "Fill the box"})
        }else if(courseData.teacherAssigned === ''){
            this.setErrors({teacherAssigned: "Fill the box"})
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

        const courseData = this.state.courseData;

        this.clearAllErrors();
        this.applyAuthentication(courseData);

        this.waitTillStateChange(()=>{
            if(!this.state.errorsExists){
                fetch('http://localhost:5000/add_course',{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(courseData)
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
                                break;
                            case 409:
                                this.setErrors({
                                    courseExist:message
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
        return (
            <div className="MainBody sidePage">
                <div className="Container">
                    <div className="FormContainer">
                        <header>
                            <h1>Add Course</h1>
                        </header>
                        {this.state.message && <span className="confirmationMessage">{this.state.message}</span>}
                        {this.state.errors.courseExist && <span className="errorMessage">{this.state.errors.courseExist}</span>}
                        <form onSubmit={this.onSubmit}>
                            <div>
                                <label 
                                    className="Label"
                                    htmlFor="courseName"
                                >
                                    Name Of Course
                                </label>
                                <div className="inputErrorDiv">
                                    <div className="inputDiv">
                                        <input
                                            type="text"
                                            id="courseName"
                                            placeholder=""
                                            value={this.state.courseData.courseName}
                                            onChange={this.onInputChange}
                                        />
                                    </div>
                                    {this.state.errors.courseName && <span className="errorMessage">{this.state.errors.courseName}</span>}
                                </div>
                            </div>
                            <div>
                                <label
                                    className="Label"
                                    htmlFor="teacherAssigned"
                                >
                                    Name Of Teacher Assigned
                                </label>
                                <div className="inputErrorDiv">
                                    <div className="inputDiv">
                                        <input
                                            type="text"
                                            id="teacherAssigned"
                                            placeholder=""
                                            value={this.state.courseData.teacherAssigned}
                                            onChange={this.onInputChange}
                                        >
                                        </input>
                                    </div>
                                    {this.state.errors.teacherAssigned && <span className="errorMessage">{this.state.errors.teacherAssigned}</span>}
                                </div>
                            </div>
                            <button className="Button">
                                Add Course
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default AddCoursePage;