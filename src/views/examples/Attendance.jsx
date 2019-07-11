import React from "react";
import axios from "axios";
// reactstrap components
import classnames from "classnames";

import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Nav,
  NavItem,
  NavLink,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Col
} from "reactstrap";

export default class Attendance extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            email : '',
            date:'',
            courses:[],
            activeCard:0,
            activeCourse:'',
            activeSection:'',
            sections:[],
            fac_code:'',
            activeButton: [],
            students:[]
        }
    
    this.handleSubmission = this.handleSubmission.bind(this);
    this.fetchStudent = this.fetchStudent.bind(this);
    this.fetchCourse = this.fetchCourse.bind(this);
    this.updateList = this.updateList.bind(this);
    }
    updateList = (i) => {
        this.setState(state => {
            const list = state.students.map((item, j) => {
              if (j === i) {
                 item.isPresent=!item.isPresent; 
                 return item;
              } else {
                return item;
              }
            });
            return{
                list,
            }
        });
        const list = this.state.activeButton.map((item, j) => {
            if (j === i) {
               item=!item; 
               return item;
            } else {
              return item;
            }
          });
          console.log(list)
        this.setState(state => ({
            activeButton:list,
        }));

    }
    
    fetchSection =(e) => {
        this.setState({
            activeCourse :this.state.courses[e],
        })
        console.log("function : fetchSection -e:" + this.state.courses[e])
        axios.post("http://3204eeee.ngrok.io/attendance/sectionList",{
            email : this.state.email,
            course : this.state.courses[e],
          }).then(res => {
            console.log({
                section: res.data.sectionList
            })
            this.setState({
                sections : res.data.sectionList,
                activeCard:2
            })
          }).catch(err => {
            this.setState({ error : "could not sign in, try again !"})
          })
    }

    fetchCourse = () => {
        axios.post("http://3204eeee.ngrok.io/attendance/courseList",{
            email : this.state.email
          }).then(res => {
            console.log({
                courses: res.data.courseList
            })
            this.setState({
                courses : res.data.courseList,
                activeCard:1
            })
          }).catch(err => {
            this.setState({ error : "could not sign in, try again !"})
          })
          
    }
    fetchStudent = (e) =>{
        console.log("function : fetchStudent -section :" + this.state.sections[e] + " course: " + this.state.activeCourse)
        this.setState({
            activeSection:this.state.sections[e],
        })
        axios.post("http://3204eeee.ngrok.io/attendance/studentList",{
            email : this.state.email,
            course : this.state.activeCourse,
            section : this.state.sections[e]
          }).then(res => {
            const list = []
            const list2=[]
            let counter=0
            console.log({
                students: res.data.studentList
            })
            for(let i =0;i< res.data.studentList.length;i++){
                let std = {}
                std['studentId']=res.data.studentList[i]
                std['ispresent']=false
                list[counter]=std
                list2[counter++]=false
            }
            this.setState({
                students : list,
                activeButton :list2,
                activeCard:3
            })
          }).catch(err => {
            this.setState({ error : "could not sign in, try again !"})
          })
          

    }
    handleSubmission = (e) => {
        e.preventDefault();
        const list = []
        let counter = 0
        const stdts = this.state.students
        console.log({
            course : this.state.activeCourse})
        for(let i=0;i<stdts.length;i++){
            let std = {}
            std['studentId']=stdts[i].studentId
            std['status']=stdts[i].isPresent?1:0
            list[counter++]=std
        }
        console.log({
            list:list
        })
        axios.post("http://3204eeee.ngrok.io/attendance/save",{
            courseCode:this.state.activeCourse,
            facultyCode:this.state.fac_code,
            date:this.state.date,
            facultyEmail:this.state.email,
            attendanceSheet : list
          }).then(data => {
            window.location.href = "/admin/index?email="+ this.state.email
          }).catch(err => {
            this.setState({ error : "could not sign in, try again !"})
          })
    
    }
    
    render(){
        return(
            <>
            
            <Col lg="5" md="7">
                {this.state.activeCard === 0 ?<Card className="bg-secondary shadow border-0">
                        <CardHeader className="bg-transparent pb-5">
                            <div className="text-muted text-center mt-2 mb-3">
                                <small>Confirm Faculty Code</small>
                            </div>
                        </CardHeader>
                        <CardBody className="justify-content-end">
                            <Form role="form">
                                <FormGroup className="mb-3">
                                    <InputGroup className="input-group-alternative">
                                        <InputGroupAddon addonType="prepend">
                                        <InputGroupText>
                                            <i className="ni ni-email-83" />
                                        </InputGroupText>
                                        </InputGroupAddon>
                                        <Input 
                                        placeholder="Email" 
                                        type="email" 
                                        onChange = { (e) => {this.setState({email:e.target.value,error:''})}}  
                                        />
                                    </InputGroup>
                                    <hr />
                                    <InputGroup className="input-group-alternative">
                                        <InputGroupAddon addonType="prepend">
                                        <InputGroupText>
                                            <i className="ni ni-badge" />
                                        </InputGroupText>
                                        </InputGroupAddon>
                                        <Input 
                                        placeholder="Faculty Code" 
                                        type="text" 
                                        onChange = { (e) => {this.setState({fac_code:e.target.value,error:''})}}  
                                        />
                                    </InputGroup>
                                </FormGroup>
                                
                                <div className="text-center">
                                    <Button 
                                    className="my-4" 
                                    color="primary" 
                                    type="button" 
                                    
                                    onClick={this.fetchCourse}>
                                        Proceed
                                    </Button>
                                </div>
                            </Form>
                        </CardBody>
                    </Card> :null}
                {this.state.activeCard === 1 ?<Card className="bg-secondary shadow border-0">
                    <CardHeader className="bg-transparent pb-5">
                        <div className="text-muted text-center mt-2 mb-3">
                            <small>Select Course</small>
                        </div>
                    </CardHeader>
                    <CardBody className="justify-content-end">
                        {this.state.courses.map((course,i) => {
                            return <Button
                                className="btn-neutral btn-icon "
                                color="default"
                                href="#pablo"
                                onClick={e => {this.fetchSection(i)}}
                                key={i}
                            >
                                
                                <span className="btn-inner--text ">{course}</span>
                            </Button>
                        })}
                    </CardBody>
                </Card> :null}
                {this.state.activeCard === 2 ?<Card className="bg-secondary shadow border-0">
                    <CardHeader className="bg-transparent pb-5">
                        <div className="text-muted text-center mt-2 mb-3">
                            <small>Select Section</small>
                        </div>
                    </CardHeader>
                    <CardBody className="justify-content-end">
                        {this.state.sections.map((section,i) => {
                            return <Button
                                className="btn-neutral btn-icon "
                                color="default"
                                href="#pablo"
                                onClick={e => this.fetchStudent(i)}
                                key={i}
                            >
                                
                                <span className="btn-inner--text ">{section}</span>
                            </Button>
                        })}
                    </CardBody>
                </Card> :null}
                {this.state.activeCard === 3 ?<Card className="bg-secondary shadow border-0">
                    <CardHeader className="bg-transparent pb-5">
                        <div className="text-muted text-center mt-2 mb-3">
                            <small>Mark Attendance</small>
                        </div>
                    </CardHeader>
                    <CardBody>
                    <Nav vertical pills>
                        {this.state.students.map((student,i) => {
                            return <NavItem key={i}>
                            <NavLink
                                className={classnames("py-2 px-3", {
                                    active: true === this.state.activeButton[i]
                                })}
                                color="default"
                                href="#pablo"
                                onClick={ ()=>this.updateList(i)}
                                id={i}
                                pills='true'
                            >
                                
                                <span className="btn-inner--text "> {student.studentId}</span>
                            </NavLink>
                            <hr />
                            </NavItem>
                        })}
                        </Nav>
                        <Form role="form">
                                <CardHeader className="bg-transparent pb-5">
                                    <div className="text-muted text-center mt-2 mb-3">
                                        <small>Enter Date</small>
                                    </div>
                                </CardHeader>
                                <FormGroup className="mb-3">
                                    <InputGroup className="input-group-alternative">
                                        <InputGroupAddon addonType="prepend">
                                        <InputGroupText>
                                            <i className="ni ni-calendar-grid-58" />
                                        </InputGroupText>
                                        </InputGroupAddon>
                                        <Input 
                                        placeholder="yyyy-mm-dd" 
                                        type="text" 
                                        onChange = { (e) => {this.setState({date:e.target.value,error:''})}}  
                                        />
                                    </InputGroup>
                                </FormGroup>
                                
                                <div className="text-center">
                                    <Button 
                                    className="my-4" 
                                    color="primary" 
                                    type="button" 
                                    onClick={this.handleSubmission}>
                                        Submit
                                    </Button>
                                </div>
                            </Form>
                    </CardBody>
                </Card> :null}
                
            </Col>
            {/* {console.log(this.state.students)}
            {console.log(this.state.activeButton)} */}
            </>
            
        );
    }
}