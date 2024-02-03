# Truth Table Generator
This is a website that generates truth tables!

https://duudiis.github.io/truth-table-generator/

Check below what are the accepted symbols and how to use the generator!

### Operations and Symbols
* `negation`: `~`  `!`  `¬`
* `and`: `&&`  `&`  `∧`
* `or`: `||`  `|`  `∨`
* `implication`: `->`  `=>`  `>`  `→`  `⇒`
* `biconditional`: `<->`  `<=>`  `<>`  `↔`  `=`  `≡`
* `exclusive`: `&|`  `|&`  `⊕`
* `nand`: `^`  `↑`
* `nor`: `v`  `↓`

### Variables
Variables are any letters from `A-Z`. (except `v`, as it is used in `nor`)

### Spaces!
Spaces are important for the generator to work!  
Please use them between variables and operators, like:  
`a -> b` or `r && (p -> ¬r)`

### Examples
```
((q → r) → ¬p) → (p → q)
!p || (!q && r)
¬q <-> (r || q)
¬ (p ^ q) ∧ ((q ∨ r -> (r ∨ ~q))
¬ ( ( ¬( p → q ) → ¬p ) → ( ( ( p → p ) → p ) → ( ( p → p ) → q ) ) )
a -> b
```
