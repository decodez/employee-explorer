import React, { Component } from 'react'

import EmployeeSearch from '../../Components/EmployeeSearch';

const API = "http://api.additivasia.io/api/v1/assignment/employees/";

export default class Explorer extends Component {

    constructor() {
        super();
    }

    state = {
        employeeName : "",
        employeePosition : "",
        directSubordinates : [],
        nonDirectSubordinates : [],
        darkMode : false,
        error: null,
    };

    componentDidMount() {
        this.getEmployeeData("John Hartman"); 
    }


    async getEmployeeData(employeeName) {
        try {

            fetch(`${API}${employeeName}`)
                .then(res => res.json())
                .then(
                (result) => {
                    let directSubordinates = this.state.directSubordinates;
                    

                    if (result[1]) {
                        directSubordinates = result[1]["direct-subordinates"]
                    }
                    this.setState({
                        employeeName: employeeName,
                        isLoaded: true,
                        employeePosition: result[0],
                        directSubordinates: directSubordinates,
                        nonDirectSubordinates: []
                    });
                    if (directSubordinates.length) {
                        directSubordinates.forEach(employee => {
                            this.getNonDirectSubordinates(employee);
                        });
                    }
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
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
            <div>
                <EmployeeSearch getEmployeeData={this.getEmployeeData.bind(this)} />
                <h1>{this.state.employeeName}</h1>
                <ul>
                    {this.state.directSubordinates.map((employee, key)=>(
                        <li key={key}>
                            {employee}
                        </li>
                    ))
                    }
                </ul>
                <ul>
                    {this.state.nonDirectSubordinates.map((employee, key)=>(
                        <li key={key}>
                            {employee}
                        </li>
                    ))
                    }
                </ul>
            </div>
        )
    }
}
