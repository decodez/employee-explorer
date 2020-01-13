import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './style.scss';

class EmployeeSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            nameValid: true,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
        this.setState({
            nameValid: true
        }) 
    }

    handleSubmit(event) {
        event.preventDefault();

        let regexName = /^[a-zA-Z\s]*$/;  

        let name = this.state.value;
 
        if(name === "") {
            this.setState({
                nameValid: false
            })
        } else if(!regexName.test(name)) {
            this.setState({
                nameValid: false
            })
        } else {
            this.props.getEmployeeData(name);
        }
    
       
        // Validation of name
        
    }

    render() {
        return (
            <div className="employee-search-wrapper">
                <form onSubmit={this.handleSubmit} className={this.state.nameValid === true ? "employee-search" : "employee-search employee-search--error"}>
                    <label>
                    <input type="text" placeholder="Search for an employee" value={this.state.value} onChange={this.handleChange} />
                    <p className="error-message"><i className="icon-alert-circle"></i> Sorry the name you have entered is invalid or empty. Please enter a valid name.</p>
                    </label>
                    <button><i className="icon-search"></i></button>
                </form>
            </div>
            
        )
    }
}


EmployeeSearch.protoTypes = {
    getEmployeeData: PropTypes.func.isRequired
}


export default EmployeeSearch;