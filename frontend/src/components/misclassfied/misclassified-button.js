import React, {useState} from 'react';
import {Button, Tooltip, Typography} from "@mui/material";
import styled from "styled-components";
import axios from "axios";
import RuleIcon from '@mui/icons-material/Rule';
import MisclassifiedForm from "./misclassfied-form";
import { API_URL } from '../../App';

const BannerContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40%;
  z-index: 9999;
`;
const MisclassifiedButton = ({onInputSet}) => {

    const [showMisclassifiedForm, setShowMisclassifiedForm] = useState(false);
    const [misclassifiedExamples, setMisclassifiedExamples] = useState([]);
    const handleModelPrediction = () => {
        axios
            .get(API_URL + "/misclassified/get-examples/", {withCredentials: true})
            .then((response) => {
                setMisclassifiedExamples(response.data.misclassified)
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                setShowMisclassifiedForm(true)
            });
    };

    return (
        <>
            <Tooltip title="Click to get misclassified examples" arrow>
            <Button variant="contained"
                    color="primary"
                    style={{
                        borderRadius: "20px",
                        maxHeight: "30px",
                        width: "50px",
                        marginLeft:"5px"
                    }}
                    onClick={() => handleModelPrediction()}

            >                    <Typography
                style={{
                    fontSize: "6px",
                }}
            >
                {" "}
                <RuleIcon/>
            </Typography></Button>
            </Tooltip>

            {showMisclassifiedForm && (
                <BannerContainer>
                    <MisclassifiedForm
                        data={misclassifiedExamples}
                        onClose={() => setShowMisclassifiedForm(false)}
                        onInputSet={onInputSet}
                    />
                </BannerContainer>
            )}

        </>

    )
}


export default MisclassifiedButton;