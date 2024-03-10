import React, {useState} from 'react';
import {
    Button,
    Divider, Grid, Paper, Table,
    TableBody,
    TableCell, TableContainer,
    TableHead, TablePagination,
    TableRow, Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import styled from 'styled-components';

const StyledPaper = styled(Paper)`
  && {
    padding: 40px;
    border-radius: 8px;
    min-width: 400px;
    background-color: #fffefe;
    color: #0a0606;
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const ExampleText = styled(Typography)`
  cursor: pointer;
  margin-bottom: 10px;
  transition: color 0.3s ease-in-out;

  &:hover {
    color: #0056e3;
  }
`;

const getModelDisplayName = (modelName) => {
    switch (modelName) {
        case 'distilbert-base-uncased-finetuned-sst-2-english':
            return 'Distilbert Base Uncased';
        case 'siebert/sentiment-roberta-large-english':
            return 'Roberta Large English';
        default:
            return modelName;
    }
};


const MisclassifiedForm = ({ onClose, data, onInputSet }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage] = useState(5);


    const handleExampleClick = (example) => {
        onInputSet(example);
        onClose();
    };

    return (
        <StyledPaper elevation={3}>
            <Grid>
                <HeaderContainer>
                    <Typography variant="h5" color="primary">
                        <b>Misclassified Examples</b>
                    </Typography>
                    <Button onClick={onClose}>
                        <CloseIcon />
                    </Button>
                </HeaderContainer>
                <Divider
                    variant="middle"
                    style={{
                        marginTop: '10px',
                        marginBottom: '20px',
                        marginLeft: '0px',
                        marginRight: '0px',
                        backgroundColor: '#666',
                    }}
                />
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Input</strong></TableCell>
                                <TableCell><strong>Model</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((example, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <ExampleText
                                            variant="subtitle1"
                                            onClick={() => handleExampleClick(example)}
                                        >
                                            {example.inputString}
                                        </ExampleText>
                                    </TableCell>
                                    <TableCell>{getModelDisplayName(example.model)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5]}
                    component="div"
                    count={data.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={(event, newPage) => setPage(newPage)}
                    onPageChange={(event, newPage) => setPage(newPage)}/>
            </Grid>
        </StyledPaper>
    );
};

export default MisclassifiedForm;