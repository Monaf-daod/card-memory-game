import React, { Component, Fragment } from "react";
import axios from "axios";
import CounterTimer from "./timer";
import "./style.css";
class Panel extends Component {
  state = {
    images: [],
    availableItems: [],
    couplesCheckedTruth: [],
    checkedStatus: [],
    won: 0,
    loss: 0,
    isTimerPlaying: false,
    isPlaying: false,
  };

  componentDidMount = () => {
    axios.get("js/data.json").then((res) => {
      this.setState({
        images: this.shuffleArray(res.data),
        availableItems: res.data,
        couplesCheckedTruth: [],
        checkItems: [],
      });
    });
  };

  toggleClicked = (id) => {
    const { images } = this.state;
    const index = images.findIndex((image) => {
      return image.id === id;
    });
    let tempimage = images[index];
    tempimage.clicked = !tempimage.clicked;
    this.setState({ images });
  };

  checkloss = () => {
    let { loss } = this.state;
    loss++;
    this.setState({ loss });
  };

  checkResaults = () => {
    let { won } = this.state;
    const { couplesCheckedTruth } = this.state;
    couplesCheckedTruth.length === 8 && won++;
    this.setState({ won });
    couplesCheckedTruth.length === 8 &&
      setTimeout(() => {
        alert("Congrates !!!! You win..");
      }, 1000);
  };
  handleReset = () => {
    axios.get("js/data.json").then((res) => {
      this.setState({
        images: this.shuffleArray(res.data),
        availableItems: res.data,
        couplesCheckedTruth: [],
        checkItems: [],
        loss: 0,
        isPlaying: false,
      });
    });
  };
  showPanel = () => {
    const { images } = this.state;
    this.setState({ isTimerPlaying: true });
    images.forEach((item) => {
      this.toggleClicked(item.id);
    });

    setTimeout(() => {
      images.forEach((item) => {
        this.toggleClicked(item.id);
      });
    }, 5000);
    this.setState({ isPlaying: true });
  };

  checkItems = (item) => {
    const { availableItems, checkedStatus } = this.state;
    if (availableItems.includes(item)) {
      const index = availableItems.findIndex((available) => {
        return available.id === item.id;
      });
      const checkedItem = availableItems[index];
      if (checkedStatus.length < 2) {
        checkedStatus.push(checkedItem);
        this.toggleClicked(checkedItem.id);
        if (checkedStatus.length === 2) {
          const a = checkedStatus[0].id;
          const b = checkedStatus[1].id;
          if (Math.abs(a - b) === 8) {
            const { couplesCheckedTruth } = this.state;
            couplesCheckedTruth.push(checkedStatus);
            this.setState({ couplesCheckedTruth });
            checkedStatus.forEach((element) => {
              let index = availableItems.findIndex((available) => {
                return available.id === element.id;
              });
              availableItems.splice(index, 1);
            });
            this.setState({ checkedStatus: [] });
          } else {
            checkedStatus.forEach((element) => {
              this.toggleClicked(element.id);
            });
            this.setState({ checkedStatus: [] });
            this.checkloss();
          }
        }
      }
    }
    this.checkResaults();
  };

  renderHide = (item) => {
    return (
      <div
        className="imageContainer"
        key={item.id}
        onClick={() => this.checkItems(item)}
      />
    );
  };

  renderShow = (item) => {
    return (
      <div
        className="imageContainer"
        key={item.id}
        onClick={() => this.checkItems(item)}
      >
        <img src={item.src} alt="item" className="myimage" />
      </div>
    );
  };
  shuffleArray = (arr) => {
    return arr
      .map((a) => [Math.random(), a])
      .sort((a, b) => a[0] - b[0])
      .map((a) => a[1]);
  };
  render() {
    const { images, couplesCheckedTruth, won, loss } = this.state;
    if (images.length) {
      const listimages = images.map((item) => {
        return (
          <Fragment key={item.id}>
            {item.clicked ? this.renderShow(item) : this.renderHide(item)}
          </Fragment>
        );
      });

      return (
        <div className="w-100 d-flex flex-column flex-lg-row justify-content-around align-items-center">
          <div className="panel-container my-1 border border-light rounded">
            {listimages}
          </div>
          <div className="d-flex flex-column justify-content-center align-items-center">
            {this.state.isTimerPlaying ? (
              <CounterTimer
                isPlaying={this.state.isTimerPlaying}
                timeDuration={5}
                colorsTime={[5, 4, 2, 0]}
                onComplete={() => this.setState({ isTimerPlaying: false })}
              />
            ) : (
              <div className="d-flex flex-column justify-content-center border border-light rounded p-3">
                <h5 className="p-1 text-dark border-bottom border-light">
                  Resaults
                </h5>
                <label className="p-1 font-weight-bold text-white">
                  Won : {won}
                </label>
                <label className="p-1 font-weight-bold text-white">
                  loss : {loss}
                </label>
                <label className="p-1 font-weight-bold text-white">
                  Couples of success : {couplesCheckedTruth.length}
                </label>
              </div>
            )}
            <div className="buttons-container mt-2">
              <button
                className="btn btn-md btn-danger"
                onClick={this.handleReset}
              >
                Reset
              </button>
              <button
                className="btn btn-md btn-primary ml-3"
                onClick={this.showPanel}
                disabled={this.state.isPlaying}
              >
                Play
              </button>
            </div>
          </div>
        </div>
      );
    } else {
      return <div />;
    }
  }
}

export default Panel;
