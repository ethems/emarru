import React from 'react'

import './styles/table-header.scss';

const TableHeader = (props) => {
    return (
        <div className="table-header-container mdl-color--white">
            <div className="table-header">
                <div className="header-type mdl-typography--title">{props.type}</div>
                <div className="table-header-search-container">
                  <input />
                </div>
            </div>
        </div>
    )
};

export default TableHeader;
