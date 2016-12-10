import React, {Component} from 'react'

import './styles/table.scss';

class Table extends Component {
    _renderList() {
        const {products} = this.props;
        return products.map((product) => {
            return (
                <li key={product.id}>
                    {product.name} {product.priceHistory.length}
                </li>
            )
        });
    }
    render() {
        return (
            <div className="table-container mdl-color--white">
                <div className="list-header">
                    <div className="product-name">Urun Adi</div>
                    <div className="price-type">Fiyat</div>
                </div>
                <div className="table-list-container">
                    <ul className="table-list">
                        {this._renderList()}
                    </ul>
                </div>
            </div>
        )
    }
}

export default Table;
