import React, {Component} from 'react';
import TableHeader from './table-header';
import TableInsert from './table-insert';
import Table from './table';
import * as productActions from '../../../actions/product-action';
import {connect} from 'react-redux';


class ProductTable extends Component {
  componentDidMount() {
      this.props.getProducts();
  }
    render() {
        return (
            <div>
                <TableHeader type="Meyve ve Sebze"/>
                <TableInsert/>
                <Table products={this.props.products}/>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({products: state.products});

export default connect(mapStateToProps, productActions)(ProductTable);
