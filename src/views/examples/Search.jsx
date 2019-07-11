import React from "react";
import axios from "axios";
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    FormGroup,
    Form,
    Input,
    InputGroupAddon,
    InputGroupText,
    InputGroup,
    Row,
    Col,
    Media,
    Table,
    Container,
  } from "reactstrap";
export default class Search extends React.Component{
    
    constructor(props){
        super(props);
        this.state = {
            activeCard:0,
            studentId:'',
            list:[],
            courseId:''

        }
    }
    fetchAttendance = () => {
        axios.post('http://3204eeee.ngrok.io/attendance/search',{
            studentId:this.state.studentId,
            courseCode:this.state.courseId
        }).then(res => {
            let la = []
            for(let i=0;i<res.data.info.length;i++){
                la[i]={}
                la[i]['date'] = res.data.info[i].date
                la[i]['attendance']=res.data.info[i].attendance
            }
            this.setState({
                list:la,
                activeCard:1
            })
        })
    }
    render(){
        return(
            <>
            
            { this.state.activeCard === 0 ? <Col lg="5" md="7" >
                <Card className="bg-secondary shadow border-0">
                        <CardHeader className="bg-transparent pb-5">
                            <div className="text-muted text-center mt-2 mb-3">
                                <small>Enter Student Details</small>
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
                                        placeholder="Student ID" 
                                        type="email" 
                                        onChange = { (e) => {this.setState({studentId:e.target.value,error:''})}}  
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
                                        placeholder="Course ID" 
                                        type="text" 
                                        onChange = { (e) => {this.setState({courseId:e.target.value,error:''})}}  
                                        />
                                    </InputGroup>
                                </FormGroup>
                                
                                <div className="text-center">
                                    <Button 
                                    className="my-4" 
                                    color="primary" 
                                    type="button" 
                                    
                                    onClick={this.fetchAttendance}>
                                        Search
                                    </Button>
                                </div>
                            </Form>
                        </CardBody>
                    </Card> 
                    </Col> : 
                    <Container className="mt--7" fluid>
                            Table
                            <Row>
                                <div className="col">
                                <Card className="shadow">
                                    <CardHeader className="border-0">
                                    <h3 className="mb-0">Card tables</h3>
                                    </CardHeader>
                                    <Table className="align-items-center table-flush" responsive>
                                    <thead className="thead-light">
                                        <tr>
                                        <th scope="col">Date</th>
                                        <th scope="col">Attendance</th>
                                        
                                        <th scope="col" />
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.list.map((item,i) => {
                                            return <tr key={i}>
                                                <th scope="row">
                                                <Media className="align-items-center">
                                                    <a
                                                    className="avatar rounded-circle mr-3"
                                                    href="#pablo"
                                                    onClick={e => e.preventDefault()}
                                                    >
                                                    <img
                                                        alt="..."
                                                        src={require("assets/img/theme/education-icon.jpg")}
                                                    />
                                                    </a>
                                                    <Media>
                                                    <span className="mb-0 text-sm">
                                                        {item.date}
                                                    </span>
                                                    </Media>
                                                </Media>
                                                </th>
                                                <td>{item.attendance}</td>
                                                
                                            </tr>
                                        })}
                                    </tbody>
                                    </Table></Card></div></Row></Container>
                    }
                    {console.log(this.state.activeCard)}
                    {console.log(this.state.studentId)}
                    {console.log(this.state.courseId)}
                    {console.log(this.state.list)}
            </>
        );
    }
}