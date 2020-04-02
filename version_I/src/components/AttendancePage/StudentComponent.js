import React, { Component } from 'react';
import './_studentComponent.scss'


class StudentComponent extends Component {


    render() {
        const { roll_no, status} = this.props
        return (
            <div className={`studentComponent_Body ${status ? "" : "studentComponent_notPresent"}`}>
                <div className="studentComponent_Container">
                    <div className="studentComponent_Data">
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