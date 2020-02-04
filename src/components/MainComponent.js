import React, {Component} from "react";
import Menu from "./MenuComponent";
import Header from "./HeaderComponent";
import Home from "./HomeComponent";
import Contact from "./ContactComponent";
import About from "./AboutComponent";
import Footer from "./FooterComponent";
import DishDetail from "./DishdetailComponent";
import {postComment, fetchDishes,fetchComments,fetchPromos} from '../redux/ActionCreators';

import {Switch, Route, Redirect, withRouter} from 'react-router-dom'
import {connect} from 'react-redux';
import {actions} from 'react-redux-form';

const mapDispatchToProps = dispatch => ({

    // addComment: (dishId, rating, author, comment) => dispatch(addComment(dishId, rating, author, comment)),
    postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment)),
    fetchDishes: () => {
        dispatch(fetchDishes())
    },
    resetFeedbackForm: () => {
        dispatch(actions.reset('feedback'))
    },
    fetchComments: () => dispatch(fetchComments()),
    fetchPromos: () => dispatch(fetchPromos())

});


const mapStateToProps = state => {
    return {dishes: state.dishes, comments: state.comments, promotions: state.promotions, leaders: state.leaders}
}

class Main extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.fetchDishes();
        this.props.fetchComments();
        this.props.fetchPromos();
    }
    onDishSelect(dishId) {
        this.setState({selectedDish: dishId});
    }

    render() {


        const HomePage = () => {
            return (
                <Home 
                dish={this.props.dishes.dishes.filter((dish) => dish.featured)[0]}
                dishesLoading={this.props.dishes.isLoading}
                dishErrMess={this.props.dishes.errMess}
                promotion={this.props.promotions.promotions.filter((promo) => promo.featured)[0]}
                promoLoading={this.props.promotions.isLoading}
                promoErrMess={this.props.promotions.errMess}
                leader={this.props.leaders.filter((leader) => leader.featured)[0]}
            />
            );
        }

        const DishWithId = ({match}) => {
            return (
                <DishDetail dish={
                        this.props.dishes.dishes.filter((dish) => dish.id === parseInt(match.params.dishId, 10))[0]
                    }
                    isLoading={
                        this.props.dishes.isLoading
                    }
                    errMess={
                        this.props.dishes.errMess
                    }
                    comments={
                        this.props.comments.comments.filter((comment) => comment.dishId === parseInt(match.params.dishId, 10))
                    }
                    postComment={this.props.postComment}
                    />
            );
        };
        const AboutPage = () => {
            return <About leaders={
                this.props.leaders
            }/>;
        };

        return (
            <div>
                <Header/>
                <Switch>
                    <Route path="/home"
                        component={HomePage}/>
                    <Route exact path="/menu"
                        component={
                            () => <Menu dishes={
                                this.props.dishes
                            }/>
                        }/>
                    <Route exact path='/contactus'
                        component={
                            () => <Contact resetFeedbackForm={
                                this.props.resetFeedbackForm
                            }/>
                        }/>

                    <Route path="/aboutus"
                        component={AboutPage}/>
                    <Route path="/menu/:dishId"
                        component={DishWithId}/>
                    <Redirect to="/home"/>


                </Switch>
                <Footer/>
            </div>
        );
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));
