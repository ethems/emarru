import React from 'react'

import './styles/table-insert.scss';

const TableInsert = (props) => {
    return (
        <div className="table-insert-container mdl-color--white">
            <div className="input-box">
              <input/>
            </div>
            <div>
              <button>Ekle</button>
            </div>
        </div>
    )
};

export default TableInsert;
