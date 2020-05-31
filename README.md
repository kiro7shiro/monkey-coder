# monkey-coder
An ai that writes programs.

#### inspired by:
https://github.com/primaryobjects/AI-Programmer

https://de.wikipedia.org/wiki/Infinite-Monkey-Theorem

## Idea

As described in Kory Beckers abstract. This program trys to solve problems by writing little programs in brainfuck. In difference to the appraoch in the original post. The agents, we call monkeys, in this program use a neural network to generate the brainfuck code. In every step of the code generation the network, we call brain, can learn if the command was good or bad.

We give the monkeys a banana if they do good. ;)

The best monkeys in a generation are selected and used as a origin for the next generation to evolve. This process is repeated until either the overall error is low enough or a specified end goal is reached.