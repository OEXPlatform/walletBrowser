import React, { Component } from 'react';
import { Button, Grid, Table, Pagination } from "@alifd/next";
import IceContainer from '@icedesign/container';
import * as oexchain from 'oex-web3';
import { T } from '../../utils/lang';
import * as utils from '../../utils/utils';

const { Row } = Grid;

export default class BlockTable extends Component {
  static displayName = 'BlockTable';

  constructor(props) {
    super(props);
    this.state = {
        filter: [
            {
              text: T("区块高度"),
              value: "height"
            },
            {
              text: T("区块哈希值"),
              value: "hash"
            }
        ],
        value: "",
        blockInfo: {},
        txNum: '',
        transactions: [],
        assetInfos: {},
        onePageNum: 10,
        current: 1,
        txFrom: {},
        blockList: [],
        curBlockNum: 0,
        curMaxBlockNum: 0,
        curMinBlockNum: 0,
        totalTxn: 0,
    };
  }

  componentDidMount = () => {
    oexchain.oex.getCurrentBlock(false).then((block) => {
      this.state.curBlockNum = block.number;
      this.setState({totalTxn: block.number});
      this.getBlockList(block.number);
    });
  }

  getBlockList = async (blockNum) => {
    this.state.curMaxBlockNum = blockNum;
    this.state.blockList = [];
    for (let i = blockNum; i > blockNum - this.state.onePageNum && i >= 0; i--) {      
      var blockInfo = await oexchain.oex.getBlockByNum(i, false);
      this.state.blockList.push(blockInfo);
      this.state.curMinBlockNum = i;
    }
    
    this.setState({
      blockList: this.state.blockList,
    });
  }
  
  onChange = (currentPage) => {
    var startNo = (currentPage - 1) * this.state.onePageNum;
    this.setState({current: currentPage});
    this.getBlockList(this.state.curBlockNum - startNo);
  }

  renderBlockNumber = (v) => {
    return <div style={{color: '#5c67f2'}}>{v}</div>;
  }

  renderMiner = (v) => {
    return <div style={{color: '#5c67f2'}}>{v}</div>;
  }

  renderTimeStamp = (value) => {
    return utils.getValidTime(value);
  }

  renderTxn = (transactions) => {
    return <div style={{color: '#5c67f2'}}>{transactions.length}</div>;
  }

  render() {
    return (
      <div className="progress-table">
        <Row justify='space-between' style={{padding: '0 20px'}}>
          <div>
            #{this.state.curMinBlockNum}区块至#{this.state.curMaxBlockNum}区块(总共{this.state.curBlockNum.toLocaleString()}个区块)
          </div>
          <Pagination hideOnlyOnePage showJump={false} shape="arrow-only" current={this.state.current} total={this.state.totalTxn} onChange={this.onChange} style={{}} />
        </Row>
        <IceContainer className="tab-card">
          <Table isZebra={false}  hasBorder={false}
            dataSource={this.state.blockList}
            primaryKey="number"
            language={T('zh-cn')}
          >
            <Table.Column title={T("区块")} dataIndex="number" width={100} cell={this.renderBlockNumber.bind(this)}/>
            <Table.Column title={T("块龄")} dataIndex="timestamp" width={150} cell={this.renderTimeStamp.bind(this)}/>
            <Table.Column title={T("交易数")} dataIndex="transactions" width={100} cell={this.renderTxn.bind(this)}/>
            <Table.Column title={T("区块大小(B)")} dataIndex="size" width={100}/>
            <Table.Column title={T("矿工")} dataIndex="miner" width={100}  cell={this.renderMiner.bind(this)}/>
            <Table.Column title={T("Gas消耗")} dataIndex="gasUsed" width={100}/>
            <Table.Column title={T("哈希")} dataIndex="hash" width={250}/>
          </Table>
          <Row justify='end'>
            <Pagination hideOnlyOnePage showJump={false} shape="arrow-only" current={this.state.current} total={this.state.totalTxn} onChange={this.onChange} style={{marginTop: '10px'}} />
          </Row>
        </IceContainer>
      </div>
    );
  }
}

const styles = {
    all: {
      height: 'auto',
      backgroundColor: '#f5f6fa',
      display: 'flex',
      justifyContent: 'start',
      flexDirection: 'column',
      alignItems: 'center'
    },
    banner: {
      width: '100%', 
      height: '310px', 
      backgroundColor: '#080a20',
      display: 'flex',
      justifyContent: 'start',
      flexDirection: 'column',
      alignItems: 'center'
    },
    container: {
      width: '78%', 
      margin: '-190px 0 20px 0',
      padding: '0',
      display: 'flex',
      justifyContent: 'start',
      flexDirection: 'column',
    },
    title: {
      margin: '0',
      padding: '15px 20px',
      fonSize: '16px',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      color: 'rgba(0,0,0,.85)',
      fontWeight: '500',
      borderBottom: '1px solid #eee',
    },
    summary: {
      padding: '20px',
    },
    item: {
      height: '40px',
      lineHeight: '40px',
    },
    label: {
      display: 'inline-block',
      fontWeight: '500',
      minWidth: '74px',
      width: '150px',
    },
    pageDemo: {
      color: '#5c67f2'
    }
  };