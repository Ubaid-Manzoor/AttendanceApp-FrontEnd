import React, { Component } from 'react';
import './_studentComponent.scss'


class StudentComponent extends Component {


    render() {
        const { roll_no, status} = this.props
        return (
            <div className={`Component_Body ${status ? "" : "Component_notPresent"}`}>
                <div className="Component_Container">
                    <div className="Component_Data">
                        <h2>
                            {roll_no}
                        </h2>
                        {
                            status && <p>Present</p>
                        }
                        {
                            !status && <p>Absent</p>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default StudentComponent;