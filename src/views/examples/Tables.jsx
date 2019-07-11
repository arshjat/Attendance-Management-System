import React from "react";
import axios from "axios";
import classnames from "classnames";
// reactstrap components
import {
  Badge,
  Card,
  CardHeader,
  CardFooter,
  Media,
  Pagination,
  PaginationItem,
  PaginationLink,
  Progress,
  Table,
  Container,
  Row,
} from "reactstrap";
// core components
import Header from "components/Headers/Header.jsx";

class Tables extends React.Component {
  constructor(props){
    super(props);
    this.state={
      students:[],
      email:'',
      showData:false,
      listOfFive:[],
      leftIndex:0,
      rightIndex:0,
      activeItem:1,
      activeItems:[1,2,3]
    }
    this.previousList = this.previousList.bind(this);
    this.nextList = this.nextList.bind(this);
    this.listNumber = this.listNumber.bind(this);
    
  }
  previousList = () =>{
    if(this.state.leftIndex>0){
      let list=[]
      let counter=0
      for(let i = this.state.leftIndex-5;i<this.state.rightIndex-5+1;i++){
        list[counter++]=this.state.students[i]
      }
      let listItems = []
      listItems[0]=this.state.activeItems[0]-3
      listItems[1]=this.state.activeItems[1]-3
      listItems[2]=this.state.activeItems[2]-3
      this.setState({
        leftIndex:this.state.leftIndex-5,
        rightIndex:this.state.rightIndex-5,
        listOfFive:list,
        activeItem:this.state.activeItem-1,
        activeItems:listItems
      })
    }
  }
  nextList = () =>{
    if(this.state.rightIndex < this.state.students.length){
      let list=[]
      let counter=0
      for(let i = this.state.leftIndex+5;i<this.state.rightIndex+5+1;i++){
        list[counter++]=this.state.students[i]
      }
      let listItems = []
      listItems[0]=this.state.activeItems[0]+3
      listItems[1]=this.state.activeItems[1]+3
      listItems[2]=this.state.activeItems[2]+3
      this.setState({
        leftIndex:this.state.leftIndex + 5,
        rightIndex:this.state.rightIndex + 5,
        listOfFive:list,
        activeItem:this.state.activeItem+1,
        activeItems:listItems
      })
    }
  }
  listNumber = (i) => {
    // console.log(i)
    if(this.state.rightIndex < this.state.students.length && this.state.leftIndex > 0){
      let list=[]
      let counter=0
      for(let j = (i-1)*5;j<(i-1)*5+5;j++){
        list[counter++]=this.state.students[j]
      }
      this.setState({
        leftIndex:this.state.leftIndex + 5,
        rightIndex:this.state.rightIndex + 5,
        listOfFive:list,
        activeItem:i
      })
    }
  }
  componentWillMount(){
    const query = new URLSearchParams(this.props.location.search);
    const token = query.get('email')
    console.log(token)
    this.setState({
      email:token
    })
    axios.post('http://3204eeee.ngrok.io/dashboard',{
      email : token
    }).then(res => {
      console.log("courseName: "+res.data.courses[0].name)
      let liSt = [];
      let counter=0;
      for(let i=0;i<res.data.courses.length;i++){
        for(let j=0;j<res.data.courses[i].sections.length;j++){
          for(let k=0;k<res.data.courses[i].sections[j].students.length;k++){
            liSt[counter]={}
            liSt[counter]['studentId']=res.data.courses[i].sections[j].students[k].studentId
            liSt[counter]['name']=res.data.courses[i].sections[j].students[k].name
            liSt[counter]['attendance']=res.data.courses[i].sections[j].students[k].attendance
            liSt[counter]['section']=res.data.courses[i].sections[j].name
            liSt[counter++]['course']=res.data.courses[i].name

          }
        }
      }
      liSt.sort(function(a,b){return b.attendance - a.attendance})
      let list5=[]
      for(let i=0;i<5;i++){
          list5[i]=liSt[i]
      }

      this.setState({
        students:liSt,
        listOfFive:list5,
        showData:true,
        leftIndex:0,
        rightIndex:4
      })
    });
  }
  render() {
    return (
      <>
        <Header render={false} small={true}/>
        {/* Page content */}
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
                      <th scope="col">Student Name</th>
                      <th scope="col">ID</th>
                      <th scope="col">Course</th>
                      <th scope="col">Section</th>
                      <th scope="col">Attendance</th>
                      <th scope="col" />
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.students.map((item,i) => {
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
                                    {item.name}
                                  </span>
                                </Media>
                              </Media>
                            </th>
                            <td>{item.studentId}</td>
                            <td>
                              <Badge color="" className="badge-dot mr-4">
                                <i className="bg-success" />
                                
                              </Badge>
                              {item.course}
                            </td>
                            <td>
                              {item.section}
                            </td>
                            {console.log(item.attendance)}
                            <td>
                              <div className="d-flex align-items-center">
                                <span className="mr-2">{item.attendance}</span>
                                <div>
                                  <Progress
                                    max="100"
                                    value={item.attendance.toString()}
                                    barClassName="bg-success"
                                  />
                                </div>
                              </div>
                            </td>
                            {/* <td className="text-right">
                              <UncontrolledDropdown>
                                <DropdownToggle
                                  className="btn-icon-only text-light"
                                  href="#pablo"
                                  role="button"
                                  size="sm"
                                  color=""
                                  onClick={e => e.preventDefault()}
                                >
                                  <i className="fas fa-ellipsis-v" />
                                </DropdownToggle>
                                <DropdownMenu className="dropdown-menu-arrow" right>
                                  <DropdownItem
                                    href="#pablo"
                                    onClick={e => e.preventDefault()}
                                  >
                                    Action
                                  </DropdownItem>
                                  <DropdownItem
                                    href="#pablo"
                                    onClick={e => e.preventDefault()}
                                  >
                                    Another action
                                  </DropdownItem>
                                  <DropdownItem
                                    href="#pablo"
                                    onClick={e => e.preventDefault()}
                                  >
                                    Something else here
                                  </DropdownItem>
                                </DropdownMenu>
                              </UncontrolledDropdown>
                            </td> */}
                          </tr>
                    })}
                  </tbody>
                </Table>
                <CardFooter className="py-4">
                  <nav aria-label="...">
                    <Pagination
                      className="pagination justify-content-end mb-0"
                      listClassName="justify-content-end mb-0"
                    >
                      <PaginationItem >
                        <PaginationLink
                          href="#pablo"
                          onClick={this.previousList}
                          tabIndex="-1"
                        >
                          <i className="fas fa-angle-left" />
                          <span className="sr-only">Previous</span>
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem className={classnames("", {
                              active: this.state.activeItem===this.state.activeItems[0]
                            })}>
                        <PaginationLink
                          href="#pablo"
                          onClick={this.listNumber(this.state.activeItems[0])}
                        >
                          {this.state.activeItems[0]}
                        </PaginationLink>
                      </PaginationItem>
                      
                      <PaginationItem className={classnames("", {
                              active: this.state.activeItem===this.state.activeItems[1]
                            })}>
                        <PaginationLink
                          href="#pablo"
                          onClick={this.listNumber(this.state.activeItems[1])}
                        >
                          {this.state.activeItems[1]}
                           <span className="sr-only">(current)</span>
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem className={classnames("", {
                              active: this.state.activeItem===this.state.activeItems[2]
                            })}>
                        <PaginationLink
                          href="#pablo"
                          onClick={this.listNumber(this.state.activeItems[2])}
                        >
                          {this.state.activeItems[2]}
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink
                          href="#pablo"
                          onClick={this.nextList}
                        >
                          <i className="fas fa-angle-right" />
                          <span className="sr-only">Next</span>
                        </PaginationLink>
                      </PaginationItem>
                    </Pagination>
                  </nav>
                </CardFooter>
              </Card>
            </div>
          </Row>
        </Container>
      </>
    );
  }
}

export default Tables;
