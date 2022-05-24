import React, { Component,Fragment } from 'react';
import axios from 'axios'
import './style.css'
class Panel extends Component {
    state = { 
        images :[],
        availableItems:[],
        couplesCheckedTruth:[],
        checkedStatus :[],
        won:0,
        loss:0,
    }

    componentDidMount = () => {
        axios.get('js/data.json').then(res => {
            this.setState({
                images : this.shuffleArray(res.data),
                availableItems :res.data,
                couplesCheckedTruth :[],
                checkItems:[]
            })
        })
    }

    toggleClicked = (id) =>{
        const {images} = this.state;
        const index = images.findIndex(image => {
            return image.id === id
        })
        let tempimage = images[index];
        tempimage.clicked = !(tempimage.clicked);
        this.setState({ images })
    }
    checkloss = () =>{
        let {loss} =this.state;
        loss++;
        this.setState({loss})
    }
    checkResaults = () =>{
        let {won} = this.state;
        const {couplesCheckedTruth} = this.state;
        couplesCheckedTruth.length === 8 && won++;
        this.setState({won})
    }
    handleReset =  () => {
            axios.get('js/data.json').then(res => {
            this.setState({
                images : this.shuffleArray(res.data),
                availableItems :res.data,
                couplesCheckedTruth :[],
                checkItems:[],
                loss:0
            })
        })
    }
    showPanel = async () =>{
        const {images} = this.state;
       await setTimeout(() => {
            images.forEach(item => {
                this.toggleClicked(item.id)
            })
        }, 0);
        await setTimeout(() => {
            images.forEach(item => {
                this.toggleClicked(item.id)
            })
        }, 5000);
        
    }

    checkItems = (item) => {
        const {availableItems} = this.state;
        const {checkedStatus} = this.state;
        if (availableItems.includes(item)) {
            const index = availableItems.findIndex(available => {
                return available.id === item.id
            } )
            const checkedItem = availableItems[index];
            if(checkedStatus.length < 2 ) {
                checkedStatus.push(checkedItem);
                this.toggleClicked(checkedItem.id);
                if(checkedStatus.length === 2 ){
                   const a = checkedStatus[0].id;
                   const b = checkedStatus[1].id;
                   if(Math.abs(a-b) === 8){
                       const {couplesCheckedTruth} = this.state;
                       couplesCheckedTruth.push(checkedStatus);
                       this.setState({couplesCheckedTruth});
                    //   console.log("numbers of truth couple is ",couplesCheckedTruth.length)
                       checkedStatus.forEach(element => {
                        let index = availableItems.findIndex(available => {
                            return available.id === element.id
                        } )
                           availableItems.splice(index,1)
                       })
                       this.setState({checkedStatus :[]});
                     //  console.log("True couple and Available items are ",availableItems);
                       
                   }
                   else{
                    checkedStatus.forEach(element => {
                        this.toggleClicked(element.id);
                    })
                    this.setState({checkedStatus :[]});
                   // console.log("False couple");
                    this.checkloss();
                   } 
                }
            } 
        }
        this.checkResaults();
    }

    renderHide = (item) =>{
        return(
            <div className="w-25 mydiv2" key={item.id} onClick={() => this.checkItems(item)}>

            </div>
        )
    } 

    renderShow = (item) =>{
        return(
            <div className=" mydiv1 w-25" key={item.id} onClick={() => this.checkItems(item)}>
                <img src={item.src} alt="" className="rounded border border-primary myimage" />
            </div>
        )
    }
     shuffleArray = (arr) => {
        return arr
          .map(a => [Math.random(), a])
          .sort((a, b) => a[0] - b[0])
          .map(a => a[1])
      }                                                                                                                                                                                                                                                                                                    
    render() { 
        const {images} = this.state;
        const {couplesCheckedTruth} = this.state;
        const {won} = this.state;
        const {loss} = this.state;
        if (images.length){
            const listimages = images.map(item =>{
                return (
                    <Fragment key={item.id}>
                        {item.clicked ? this.renderShow(item) : this.renderHide(item)}
                    </Fragment>      
                )
            })
        
            return (
                    <Fragment>
                        <div className="w-75 d-flex flex-row flex-wrap align-self-center my-2 border border-primary">
                    {listimages}
                                              
                    </div>
                    <div className ="w-50 m-auto border border-primary">
                       Resault :<br/>
                       <span>Won : {won}</span> <br/>
                       <span>loss : {loss}</span> <br/>
                       <span>Couples of success : {couplesCheckedTruth.length}</span><br/> 
                    </div>
                    <div className ="w-50 mx-auto my-2 border border-primary d-flex justify-content-around">
                        <button className="btn btn-danger btn-sm" onClick={this.handleReset}>Reset</button>
                        <button className="btn btn-primary btn-sm" onClick={this.showPanel}>Play</button>
                    </div>
                    </Fragment>
            );
        }
        else{
            return (
                    <div className="w-75 d-flex flex-row flex-wrap align-self-center my-2 border border-primary">                       
                    </div>
                    
        );
        }
    }
}
 
export default Panel ;