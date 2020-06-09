# MonkeyCoder 0.1

The coder represents the application to which the user interacts through the page ui. It spawns the first generation of monkeys and supervieses the evolving process.

TODOS:
- ability to manipulate the evolving process through change parameters in the ui, includes the mvc pattern, too.
    - config form --done--
- provide visual feedback to the user about the evolution process
    - status bar --done--
    - table of elite monkeys
    - make a interpreter widget
    - interpret best code

## Generation
A generation holds an array of monkeys and provides an interface for controlling the evolution process.
- select elite monkeys
- reproduce monkeys

## Monkey
Monkeys are the agents of this program and try to solve problems by generating brainfuck code. For that they include a neural network that can learn over time to produce better commands.
They hold a genome that can be used to produce an offspring monkey.

- program flow : 
    - switch input
    - activate brain
    - make code
    - calc error
    - find target command
    - train brain
    - send update

## Brain
The brain of a monkey is a neural network. Due to the high demand of process power a network could possibly have. I decide to export this into a worker. 

## TrainingSet
This represents the training data that is used to evolve the monkeys. Usally this is a table where each row represents an input. The last filled cell of a row represents the target output. Every cell before that is desiered as input value.
For convience it provides functionallty to load Excel files.

## Normalized
Reperesents normalized training data. Usally neural networks only process input values between 0 and 1. For that any human readable input has to be converted. This class provides an interface for setting up such conversion.

### Normalized data in monkey coder
In this program we took human readable strings as the input. For converting those strings into numbers we use the ascii table. Therefore we define the input scale between 32 and 127. As this range represents the readable charaters in the table. An input of 32 would be zero and an input of 127 would be one.
The brainfuck commands are decoded in the same way except the scale is between 0 and 7.