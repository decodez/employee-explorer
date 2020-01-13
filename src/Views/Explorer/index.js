import React, { Component } from 'react'

export default class Explorer extends Component {

    constructor() {
        super();
    }

    state = {
        employeeName : "John Hartman",
        employeePosition : "",
        directSubordinates : [],
        nonDirectSubordinates : [],
        darkMode : false
    };

    componentDidMount() {
        this.getEmployeeData(this.state.employeeName); 
    }


    async getEmployeeData() {
        try {

            fetch(`http://api.additivasia.io/api/v1/assignment/employees/${this.state.employeeName}`)
                .then(res => res.json())
                .then(
                (result) => {
                    let directSubordinates = this.state.directSubordinates;

                    if (result[1]) {
                        directSubordinates = result[1]["direct-subordinates"]
                    }
                    this.setState({
                        isLoaded: true,
                        employeePosition: result[0],
                        directSubordinates: directSubordinates
                    });

                    directSubordinates.map(employee => {
                        this.getNonDirectSubordinates(employee);
                    });
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

            fetch(`http://api.additivasia.io/api/v1/assignment/employees/${employee}`)
                .then(res => res.json())
                .then(
                (result) => {
                    let nonDirectSubordinates = this.state.nonDirectSubordinates;
                    console.log(result);
                    if (result[1]) {
                        result[1]["direct-subordinates"].map(item => {
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

                    console.log(this.state);

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
    render() {
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
