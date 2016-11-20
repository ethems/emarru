import React from 'react'

import './styles/table-header.scss';

const TableHeader = (props) => {
    return (
        <div className="table-header-container mdl-color--white">
            <div className="table-header">
                <div className="header-type mdl-typography--headline">{props.type}</div>
                <div className="actions">
                    <div className="action">
                        <i className="material-icons">delete_forever</i>
                    </div>
                    <div className="action">
                        <i className="material-icons">add</i>
                    </div>
                </div>
            </div>
            <div className="list-header">
                <div className="product-name">Urun Adi</div>
                <div className="price-type">Fiyat</div>
            </div>
        </div>
    )
};

export default TableHeader;
