import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
// reactstrap components
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Navbar,
  Nav,
  Container,
  Media
} from "reactstrap";


class AdminNavbar extends React.Component {
  constructor(props){
    super(props);
    this.state={
      
      name:''
    }
  }
  componentWillMount(){
    const query = new URLSearchParams(this.props.location.search);
    const token = query.get('email')
    console.log(token)
    axios.post('http://43dd2d84.ngrok.io/faculty',{
          email:token
    }).then(res=>{
      // console.log(res.data.name)
      this.setState({
        name:res.data.name
      })
    })

    
  }
  render() {
    return (
      <>{this.state.name !== null ?
        <Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
          <Container fluid>
            <Link
              className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block"
              to="/"
            >
              {this.props.brandText}
            </Link>
            {/* <Form className="navbar-search navbar-search-dark form-inline mr-3 d-none d-md-flex ml-lg-auto">
              <FormGroup className="mb-0">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="fas fa-search" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input placeholder="Search" type="text" />
                </InputGroup>
              </FormGroup>
            </Form> */}
            <Nav className="align-items-center d-none d-md-flex" navbar>
              <UncontrolledDropdown nav>
                <DropdownToggle className="pr-0" nav>
                  <Media className="align-items-center">
                    <span className="avatar avatar-sm rounded-circle">
                      <img
                        alt="..."
                        src={require("assets/img/theme/team-4-800x800.jpg")}
                      />
                    </span>
                    <Media className="ml-2 d-none d-lg-block">
                      <span className="mb-0 text-sm font-weight-bold">
                        {this.state.name}
                      </span>
                    </Media>
                  </Media>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-arrow" right>
                                  
                  <DropdownItem href="#pablo" onClick={e => {window.location.href = "/auth/login"}}>
                    <i className="ni ni-user-run" />
                    <span>Logout</span>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
          </Container>
          {console.log(this.state.name)}
        </Navbar> : null}
      </>
    );
  }
}

export default AdminNavbar;
