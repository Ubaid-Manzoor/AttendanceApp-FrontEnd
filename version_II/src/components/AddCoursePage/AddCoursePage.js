import React , { Component } from 'react';
import { connect } from 'react-redux';

import { getAndSetDepartments } from '../../actions/department';
import { getAndSetTeachers } from '../../actions/teachers';

import setInputState from '../../genericFunctions/setInputState';
import handleSubmit from '../../genericFunctions/handleSubmit';
import clearMessage from '../../genericFunctions/clearMessage';


class AddCoursePage extends Component{
    constructor(props){
        super(props);

        this.state = {
            data: {
                name: "",
                department: "",
                semester: 1,
                teacherAssigned: ""
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


    /////////////////// INPUT HANDLERS /////////////////////////////

    onInputChange = (e)=>{
        const value = e.target.value;
        const name = e.target.id;
        // FETCH ONLY TEACHER OF CORRESPONDING DEPARTMENT
        if(name === "department"){
            const teacherFilters = {
                "department": value
            };
            const teacherProjection = {};
            this.props.setTeachers(teacherFilters,teacherProjection)
            .then(()=>{
                const teacher = this.props.teachers[0]
                /**
                 * CHECK IF TEACHER IS EMPTY
                 */
                if(teacher){
                    setInputState.call(this,"data","teacherAssigned",this.props.teachers[0]['name'])
                }else{
                    /**
                     * IF THERE IS NOT TEACHER IN THE DEPARTMENT
                     * WE HAVE TO GIVE AN ERROR
                     * TO ADD TEACHER IN THE DEPARTMENT FIRST
                     * 
                     * AND
                     * 
                     * SET TEACHER TO EMPTY STRING IN data
                     */
                    setInputState.call(this,"data","teacherAssigned","")
                    this.setErrors({
                        "otherError": "No Teacher ADDED to the Department"
                    })
                }
            })   
        }

        setInputState.call(this,"data",name,value);
    }


    setDefaultState = ()=>{
        console.log(this.props);
        const department = this.props.departments ? this.props.departments[0]['name'] : ""
        const teacherAssigned = this.props.teachers ? this.props.teachers[0]['name'] : ""
        setInputState.call(this,"data","department",department);
        setInputState.call(this,"data","teacherAssigned",teacherAssigned);
    }


    /////////////////////// INPUT HANDLERS ENDS //////////////////////


    /////////////////////// ERROR HANDLERS //////////////////////////

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
            otherError: "",
            exists: ""
        })
        this.setState({errorsExists: false});
    }

    applyAuthentication(){
        const data = this.state.data; 
        return new Promise((resolve, reject)=>{
            if(data.name === ''){
                this.setErrors({name: "Fill the box"})
            }
            if(data.teacherAssigned === ''){
                this.setErrors({
                    "otherError": "No Teacher ADDED to the Department"
                })
            }
            resolve();
        })
    }

    /////////////////////// ERROR HANDLERS ENDS ////////////////////////

    /////////////////////// REQUEST RELATED FUNCTIONS //////////////////////

    handleResponse = (response)=>{
        const { message , status } = response.result;

        if(response.status === 200){
            switch(status){
                case 201:
                    console.log(message)
                    this.setState({
                        message
                    },clearMessage.bind(this,3000))
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
    }

    

    onSubmit = (e)=>{
        e.preventDefault();

        const url = 'http://localhost:5000/add_course';
        handleSubmit.call(this,url);

    }


    /////////////////////// REQUEST RELATED FUNCTIONS ENDS //////////////////////
    

    ////////////////////// LIFE CYCLE FUNCTIONS /////////////////////////////////

    componentDidMount = ()=>{
        /**
         * AFTER RENDER IS DONE FETCH ALL DEPARTMENT AND TEACHER 
         * IN THAT DEPARTMENT
         */

        /**
         * setDepartments
         * 
         * WILL FETCH THE DEPARTMENT AND SET THEM IN THE STORE
         */
        this.props.setDepartments()
        .then(()=>{

            // SET A DEFAULT DEPARTMENT IN STATE
            const defaultDepartment = this.props.departments[0].name;
            setInputState.call(this,"data","department",defaultDepartment);

            const teacherFilters = {
                "department": defaultDepartment
            }
            const teacherProjection = {}
            /**
             * setTeachers
             * 
             * WILL FETCH THE TEACHER AND SET THEM IN THE STORE
             */
            this.props.setTeachers(teacherFilters, teacherProjection)
            .then(
                /**
                 *  THIS FUNCTION WILL SET DEFAULT VALUE FOR  
                 *  DEPARTMENT AND TEACHERASSIGNED IN THE STATE 
                 */
                this.setDefaultState
            )
            
        })
    }

    ////////////////////// LIFE CYCLE FUNCTIONS ENDS /////////////////////////////////

    render() {
        const listOfDepartments = this.props.departments;
        const listOfTeachers = this.props.teachers;

        return (
            <div className="MainBody sidePage">
                <div className="Container">
                    <div className="FormContainer">
                        <header>
                            <h1>Add Course</h1>
                        </header>
                        {this.state.message && <span className="confirmationMessage">{this.state.message}</span>}
                        {this.state.errors.otherError && <span className="errorMessage">{this.state.errors.otherError}</span>}
                        {this.state.errors.exists && <span className="errorMessage">{this.state.errors.exists}</span>}
                        <form onSubmit={this.onSubmit}>
                            <div>
                                <label 
                                    className="Label"
                                    htmlFor="name"
                                >
                                    Name Of Course
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
                            <div>
                                <label className="Label" htmlFor="department">Department</label>
                                <div className="selectDiv">
                                    <select 
                                        id="department"
                                        name="department"
                                        value={this.state.data.department}
                                        onChange={this.onInputChange}
                                    >
                                        {
                                            !!listOfDepartments &&
                                            listOfDepartments.map( department =>{
                                                const { name } = department
                                                return <option key={name} value={name}>{name}</option>
                                            })
                                        }
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="Label" htmlFor="teacher">Teacher Assigned</label>
                                <div className="selectDiv">
                                    <select 
                                        id="teacherAssigned"
                                        name="teacher"
                                        value={this.state.data.teacher}
                                        onChange={this.onInputChange}
                                    >
                                        {
                                            !!listOfTeachers &&
                                            listOfTeachers.map( teacher =>{
                                                const { name } = teacher
                                                return <option key={name} value={name}>{name}</option>
                                            })
                                        }
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="Label" htmlFor="semester">Semester</label>
                                <div className="selectDiv">
                                    <select 
                                        id="semester"
                                        name="semester"
                                        // value={this.state.data.semester}
                                        onChange={this.onInputChange}
                                    >
                                        <option  value="1">1</option>
                                        <option  value="2">2</option>
                                        <option  value="3">3</option>
                                        <option  value="4">4</option>
                                        <option  value="5">5</option>
                                        <option  value="6">6</option>
                                        <option  value="7">7</option>
                                        <option  value="8">8</option>
                                    </select>
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

////////////////////// STUFF RELATED TO REDUX STORE /////////////////////

const mapStateToProps = (state)=>{
    return {
        departments: state.departments,
        teachers: state.teachers
    }
}

const mapDispatchToProps = (dispatch)=>{
    return{
        setTeachers : (filters,projection) => dispatch(getAndSetTeachers(filters,projection)),
        setDepartments: (filters,projection) => dispatch(getAndSetDepartments(filters,projection))
    }
}

////////////////////// STUFF RELATED TO REDUX STORE ENDS /////////////////////


export default connect(mapStateToProps,mapDispatchToProps)(AddCoursePage);