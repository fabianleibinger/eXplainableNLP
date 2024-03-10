import {ThemeProvider} from "styled-components";
import theme from "../../styles";
import React from "react";
import {Link} from "react-router-dom";
import {Container, Paper, Typography, Button, Grid} from "@mui/material";
import Background from './landingPage.png'
import "./welcome.css";

function Welcome() {
    let body = "Explore the fascinating world of Explainable Natural Language Processing (XNLP). \n " +
        "Discover the power to not only understand but also critically analyze text classification models " +
        "through intuitive visualizations and examples—opening a world of possibilities for users at any expertise level."
    return (
        <ThemeProvider theme={theme}>
            <div id='welcome-container'>
                <div className='welcome-header'>
                    <Typography variant="h2" gutterBottom>
                        Welcome to XNLP!
                    </Typography>
                    <Typography className='welcome-text' variant="h5" >
                        {body}
                    </Typography>
                    <Link to="/auth" style={{textDecoration: "none"}}>
                        <Button
                            className={"get-started-btn"}
                            variant="contained"
                            color="primary"
                        >
                            Get started
                        </Button>
                    </Link>
                </div>
                <img
                    id="welcome-image"
                    src={Background}
                    alt='dashboard-image'
                />
            </div>
        </ThemeProvider>
    );
}

export default Welcome;
