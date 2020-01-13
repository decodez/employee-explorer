import React, { Component } from 'react';
import { Link } from 'react-router-dom';

const API = "http://api.additivasia.io/api/v1/assignment/employees/";

class EmployeeOverview extends Component {



    componentDidMount() {
        const { params } = this.props.match
        this.getEmployeeData(params.employeeName);
    }


    state = {
        employeeName : "",
        employeePosition : "",
        directSubordinates : [],
        nonDirectSubordinates : [],
        noResult: false,
        error: null,
    };


    async getEmployeeData(employeeName) {
        try {

            fetch(`${API}${employeeName}`)
                .then(res => res.json())
                .then(
                (result) => {
                    let directSubordinates = this.state.directSubordinates;
                    let employeePosition = this.state.employeePosition;
                    
                    if (result[1]) {
                        directSubordinates = result[1]["direct-subordinates"]
                        employeePosition = result[0];
                    }
                    this.setState({
                        employeeName: result.length ? employeeName : "No matching results",
                        noResult: false,
                        employeePosition: employeePosition,
                        directSubordinates: directSubordinates,
                        nonDirectSubordinates: []
                    });
                    if (directSubordinates.length) {
                        directSubordinates.forEach(employee => {
                            this.getNonDirectSubordinates(employee);
                        });
                    }
                },

                (error) => {
                    this.setState({
                        error
                    });
                }
                )

        } catch (err) {
            console.log(err);
            this.setState({
                error: err,
                noResult: true,
            })
        }
    }

    async getNonDirectSubordinates(employee) {
        try {

            fetch(`${API}${employee}`)
                .then(res => res.json())
                .then(
                (result) => {
                    let nonDirectSubordinates = this.state.nonDirectSubordinates;
                    console.log(result);
                    if (result[1]) {
                        result[1]["direct-subordinates"].forEach(item => {
                            if(nonDirectSubordinates.indexOf(item) === -1) {
                                nonDirectSubordinates.push(item);
                                this.getNonDirectSubordinates(item)
                            }
                        });
                    }
                    
                    this.setState({
                        isLoaded: true,
                        nonDirectSubordinates: nonDirectSubordinates
                    });
                },

                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
                )

        } catch (err) {
            console.log(err);
        }
    }

    render() {
        return (
            <div className="employee-overview">
                <h1 className="page-title">Employee Overview</h1>
                <div className="container">                
                    <div className="employee-info">
                    
                        <div className="employee-info__detail">
                            {this.state.employeeName.length > 0 && <h2 className="employee-info__name">{this.state.employeeName}</h2>}
                            
                            {this.state.employeePosition.length > 0 && <p className="employee-info__position">{this.state.employeePosition}</p>}
                        </div>
                        
                        {this.state.directSubordinates.length > 0 && <div className="employee-info__list">
                            <h3>Direct Subordinates</h3>
                            <ul>
                                {this.state.directSubordinates.map((employee, key)=>(
                                    <li key={key}>
                                        {employee}
                                    </li>
                                ))
                                }
                            </ul>
                        </div> }
                        
                        {this.state.nonDirectSubordinates.length > 0 && <div className="employee-info__list">
                            <h3>Non-direct Subordinates</h3>
                            <ul>
                                {this.state.nonDirectSubordinates.map((employee, key)=>(
                                    <li key={key}>
                                        {employee}
                                    </li>
                                ))
                                }
                            </ul>
                        </div> }
                    </div>
                </div>
            </div>
        )
    }
}

export default EmployeeOverview;