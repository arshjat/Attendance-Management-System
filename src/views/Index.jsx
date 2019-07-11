import React from "react";
// node.js library that concatenates classes (strings)
import classnames from "classnames";
// javascipt plugin for creating charts
import Chart from "chart.js";
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Container,
  Row,
  Col
} from "reactstrap";
import {
  chartOptions,
  parseOptions,
} from "variables/charts.jsx";
import Header from "components/Headers/Header.jsx";
import axios from "axios";

// import Index from "views/Index.jsx";
// import Profile from "views/examples/Profile.jsx";
// import Tables from "views/examples/Tables.jsx";
// ***********************************************************************
var colors = {
  gray: {
    100: "#f6f9fc",
    200: "#e9ecef",
    300: "#dee2e6",
    400: "#ced4da",
    500: "#adb5bd",
    600: "#8898aa",
    700: "#525f7f",
    800: "#32325d",
    900: "#212529"
  },
  theme: {
    default: "#172b4d",
    primary: "#5e72e4",
    secondary: "#f4f5f7",
    info: "#11cdef",
    success: "#2dce89",
    danger: "#f5365c",
    warning: "#fb6340",
    warningTwo: "##FF7A87"
  },
  black: "#12263F",
  white: "#FFFFFF",
  transparent: "transparent"
};

// *************************************************************************
class Index extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      activeCourse: 0,
      activeSection: 0,
      // chartExample1Data: "data1",
      data: {
        labels:["jan","feb","march"],
        datasets:[
          {
          label:"attendance",
          data:[2,6,4]
          }
        ]
      },
      studentsList:[],
      graph2data:[],
      fullInfo : {},
      courses : [],
      error:'',
      showData : false
    };
    this.toggleCourses = this.toggleCourses.bind(this);
    this.toggleSections = this.toggleSections.bind(this);

  }
  // **********************************************
  //  FUNCTION THAT IS USED TO CHANGE THE COURSE SELECTION DATA IN GRAPH 1 CORRESPONDING TO INPUT
  toggleCourses = (e, index) => {
    e.preventDefault();
    const graph1Data = {
      labels:this.state.fullInfo.courses[index].sections[0].months,
      datasets:[{
         data:this.state.fullInfo.courses[index].sections[0].monthAttendance
      }]
    }
    this.setState({
      activeCourse: index,
      activeSection:0,
      data : Object.assign({},this.state.data,{
        datasets : graph1Data.datasets,
        labels:graph1Data.labels
      })
    });
    let wow = () => {
      console.log(this.state);
    };
    wow.bind(this);
    setTimeout(() => wow(), 1000);
  };

  //  FUNCTION THAT IS USED TO CHANGE THE SECTION SELECTION DATA IN GRAPH 1 CORRESPONDING TO INPUT
  toggleSections = (e, index) => {
    e.preventDefault();
    const graph1Data = {
      labels:this.state.fullInfo.courses[this.state.activeCourse].sections[index].months,
      datasets:[{
         data:this.state.fullInfo.courses[this.state.activeCourse].sections[index].monthAttendance
      }]
    }
    // console.log(this.state.fullInfo.courses[this.state.activeCourse].sections[index].monthAttendance)
    this.setState({
      activeSection: index,
      data : Object.assign({},this.state.data,{
        datasets : graph1Data.datasets,
        labels:graph1Data.labels
      })
    });
    let wow = () => {
      console.log(this.state);
    };
    wow.bind(this);
    setTimeout(() => wow(), 1000);

  };
  // *************************************************
  
  componentWillMount() {
    const query = new URLSearchParams(this.props.location.search);
    const token = query.get('email')
    console.log(token)
    this.setState({
      token:token
    })
    axios.post('http://3204eeee.ngrok.io/dashboard',{
      email : token
    }).then(res => {
        
      // RENDERING GRAPH 1
      if(res.data.courses!==null && res.data.courses.sections!==null){
        if (res.data.courses[0].sections[0].months.length>0 && res.data.courses[0].sections[0].monthAttendance.length>0){
          const graph1Data = {
            labels:res.data.courses[0].sections[0].months,
            datasets:[{
               data:res.data.courses[0].sections[0].monthAttendance
            }]
          }
          // console.log(graph1Data)
          this.setState({
          data : Object.assign({},this.state.data,{
            datasets : graph1Data.datasets,
            labels:graph1Data.labels
          })
        });
      }
      else{
        window.location.href='/wrong'
      }
    }
      
      // ADDING ALL THE COURSE NAMES TO STATE ARRAY : COURSES
      let liCo = [];
      for (let i=0;i<res.data.courses.length;i++){
          liCo[i] = res.data.courses[i].courseId
      }
      let liSe = [];
      for(let i=0;i<res.data.courses.length;i++){
          liSe[i]=res.data.courses[i].totalAttendance
      }
      let liSt = [];
      let counter=0;
      for(let i=0;i<res.data.courses.length;i++){
        for(let j=0;j<res.data.courses[i].sections.length;j++){
          for(let k=0;k<res.data.courses[i].sections[j].students.length;k++){
            liSt[counter]=res.data.courses[i].sections[j].students[k]
            liSt[counter]['section']=res.data.courses[i].sections[j].name
            liSt[counter++]['course']=res.data.courses[i].name

          }
        }
      }
      liSt.sort(function(a,b){return a.attendance - b.attendance})
 // RENDERING GRAPH 2
      
      this.setState({
        courses : liCo,
        fullInfo : res.data,
        graph2data:liSe,
        showData : true,
        studentsList : liSt
      });
     

    });
    if (window.Chart) {
      parseOptions(Chart, chartOptions());
    }
  }
// *******************************************************
  render() {
    
    return this.state.showData  ? (
      <>
        {console.log(this.state.studentsList)}
        {/* {console.log(this.state.fullInfo.courses[this.state.activeCourse].sections[this.state.activeSection].monthAttendance)} */}

        <Header  />
        {/* <Sidebar
          {...this.props}
          routes={routes}
        /> */}
        {/* Page content */}
        <Container className="mt--7" fluid>
          <Row>
            <Col className="mb-5 mb-xl-0" xl="8">
              <Card className="bg-gradient-default shadow">
                <CardHeader className="bg-transparent">
                  <Row className="align-items-center">
                    <div className="col">
                      <h6 className="text-uppercase text-light ls-1 mb-1">
                        Overview
                      </h6>
                      <h2 className="text-white mb-0">Monthly Attendance</h2>
                    </div>
                    <div className="col">
                      <Nav className="justify-content-end" pills>
                        { this.state.courses.map((course,i)=>{
                          return <NavItem key = {i}>
                          <NavLink
                            className={classnames("py-2 px-3", {
                              active: i === this.state.activeCourse
                            })}
                            href="#pablo"
                            onClick={e => this.toggleCourses(e, i)}
                            
                          >
                            <span className="d-none d-md-block">{this.state.courses[i]}</span>
                            <span className="d-md-none">A</span>
                          </NavLink>
                        </NavItem>
                        })
                        }
                      </Nav>
                       <Nav className="justify-content-end">
                        <div>{"----------------------------------------"}</div>
                      </Nav>
                    
                      
                       <Nav className="justify-content-end" pills>
                        { this.state.fullInfo.courses[this.state.activeCourse].sections.map((section,i)=>{
                          return <NavItem key={i}>
                          <NavLink
                            className={classnames("py-2 px-3", {
                              active: i === this.state.activeSection
                            })}
                            href="#pablo"
                            onClick={e => this.toggleSections(e, i)}
                            
                          >
                            <span className="d-none d-md-block">{this.state.fullInfo.courses[this.state.activeCourse].sections[i].name}</span>
                            <span className="d-md-none">A</span>
                          </NavLink>
                        </NavItem>
                        })
                        }
                      </Nav> 
                    </div>
                  </Row>
                </CardHeader>
                <CardBody>
                  {/* Chart */}
                  <div className="chart">
                    {/* ********************************************************** */}
                    <Line
                      data = {this.state.data}
                      options={{
                        scales: {
                          yAxes: [
                            {
                              gridLines: {
                        
                                color: colors.gray[900],
                                zeroLineColor: colors.gray[900]
                              },
                              ticks: {
                                callback: function(value) {
                                  if (!(value % 10)) {
                                    return "" + value + "%";
                                  }
                                }
                              }
                            }
                          ]
                        },
                        tooltips: {
                          callbacks: {
                            label: function(item, data) {
                              var label = data.datasets[item.datasetIndex].label || "";
                              var yLabel = item.yLabel;
                              var content = "";

                              if (data.datasets.length > 1) {
                                content += label;
                              }

                              content += "" + yLabel + "%";
                              return content;
                            }
                          }
                        }
                      }}
                      getDatasetAtEvent={e => console.log(e)}
                    />
                  }
                  </div>
                  {/* *********************************************************************** */}
                </CardBody>
              </Card>
            </Col>
            <Col xl="4">
              <Card className="shadow">
                <CardHeader className="bg-transparent">
                  <Row className="align-items-center">
                    <div className="col">
                      <h6 className="text-uppercase text-muted ls-1 mb-1">
                        Percentage Attendance
                      </h6>
                      <h2 className="mb-0">Course Wise</h2>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody>
                  {/* Chart */}
                  <div className="chart">
                    <Bar
                      data={{
                            labels: this.state.courses,
                            datasets: [
                              {
                                label: "Sales",
                                data: this.state.graph2data
                              }
                            ]
                          }
                        }
                      options={{
                        scales: {
                          yAxes: [
                            {
                              ticks: {
                                callback: function(value) {
                                  if (!(value % 10)) {
                                    //return '$' + value + 'k'
                                    return value;
                                  }
                                }
                              }
                            }
                          ]
                        },
                        tooltips: {
                          callbacks: {
                            label: function(item, data) {
                              var label = data.datasets[item.datasetIndex].label || "";
                              var yLabel = item.yLabel;
                              var content = "";
                              if (data.datasets.length > 1) {
                                content += label;
                              }
                              content += yLabel;
                              return content;
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row className="mt-5">
            <Col className="mb-5 mb-xl-0" xl="8">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <Row className="align-items-center">
                    <div className="col">
                      <h3 className="mb-0">Defaulters</h3>
                    </div>
                    <div className="col text-right">
                      <Button
                        color="primary"
                        href="#pablo"
                        onClick={e => window.location.href='/admin/tables?email='+ this.state.email}
                        size="sm"
                      >
                        See all
                      </Button>
                    </div>
                  </Row>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Student name</th>
                      <th scope="col">Student ID</th>
                      <th scope="col">Course</th>
                      <th scope="col">Percentage</th>
                      <th scope="col">Section</th>
                    </tr>
                  </thead>
                  <tbody>
                  { this.state.studentsList.slice(0,5).map((student,i)=>{
                    return <tr key={i}>
                      <th scope="row">{student.name}</th>
                  <td>{student.studentId}</td>
                  {console.log(student)}
                      <td>{student.course}</td>
                      <td>
                        <i className="fas fa-arrow-down text-warning mr-3" />{" "}
                        {student.attendance}
                      </td>
                      <td>{student.section}</td>
                    </tr>
                    })
                  }
                  </tbody>
                </Table>
              </Card>
            </Col>
            <Col xl="4">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <Row className="align-items-center">
                    <div className="col">
                      <h3 className="mb-0">Examination Attendance </h3>
                    </div>
                    <div className="col text-right">
                      <Button
                        color="primary"
                        href="#pablo"
                        onClick={e => e.preventDefault()}
                        size="sm"
                      >
                        See all
                      </Button>
                    </div>
                  </Row>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Exam</th>
                      <th scope="col">Attendance</th>
                      <th scope="col">Course</th>
                      <th scope="col" />
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">Quiz 1</th>
                      <td>120</td><td>
                        <div className="d-flex align-items-center">
                          <span className="mr-2">60%</span>
                          <div>
                            <Progress
                              max="100"
                              value="60"
                              barClassName="bg-gradient-danger"
                            />
                          </div>
                        </div>
                      </td>
                      <td>{this.state.studentsList[0].course}</td>
                    </tr>
                    <tr>
                      <th scope="row">Mid Sem</th>
                      <td>140</td><td>
                        <div className="d-flex align-items-center">
                          <span className="mr-2">70%</span>
                          <div>
                            <Progress
                              max="100"
                              value="70"
                              barClassName="bg-gradient-success"
                            />
                          </div>
                        </div>
                      </td>
                      <td>{this.state.studentsList[0].course}</td>
                    </tr>
                    <tr>
                      <th scope="row">Quiz 2</th>
                      <td>160</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <span className="mr-2">80%</span>
                          <div>
                            <Progress max="100" value="80" />
                          </div>
                        </div>
                      </td>
                      <td>{this.state.studentsList[0].course}</td>
                    </tr>
                    <tr>
                      <th scope="row">Surprise Test</th>
                      <td>60</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <span className="mr-2">30%</span>
                          <div>
                            <Progress
                              max="100"
                              value="30"
                              barClassName="bg-gradient-info"
                            />
                          </div>
                        </div>
                      </td>
                      <td>{this.state.studentsList[0].course}</td>
                    </tr>
                    <tr>
                      <th scope="row">End Sem</th>
                      <td>150</td>
                      
                      <td>
                        <div className="d-flex align-items-center">
                          <span className="mr-2">30%</span>
                          <div>
                            <Progress
                              max="100"
                              value="75"
                              barClassName="bg-gradient-warning"
                            />
                          </div>
                        </div>
                      </td>
                      <td>{this.state.studentsList[0].course}</td>
                    </tr>
                  </tbody>
                </Table>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
      
    ) : null;
  }
}

export default Index;
