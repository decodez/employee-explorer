import React, { Component } from 'react';

const API = "http://api.additivasia.io/api/v1/assignment/employees/";

class EmployeeOverview extends Component {

    state = {
        employeeName : "",
        employeePosition : "",
        directSubordinates : [],
        nonDirectSubordinates : [],
        darkMode : false,
        error: null,
    };

    componentDidMount() {
        this.getEmployeeData(this.props.match.params.employeeName);
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
        console.log(this.props);   
        return (
            <div>
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

export default EmployeeOverview;