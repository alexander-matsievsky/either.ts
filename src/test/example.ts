import {Either, Left, Right} from "../main/lib";

class VectorIsEmpty extends Error {
}

function mean(xs:number[]):Either<VectorIsEmpty, number> {
    return xs.length === 0
        ? Left(new VectorIsEmpty(`xs = ${JSON.stringify(xs)}`))
        : Right(xs.reduce(($1, $2) => $1 + $2, 0) / xs.length);
}

function variance(xs:number[]):Either<VectorIsEmpty, number> {
    return mean(xs).flatMap(m =>
        mean(xs.map(x =>
            Math.pow(x - m, 2)
        ))
    );
}

const xs = Math.random() < .25 ? [] : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

console.log(`\
mean:
    ${mean(xs)}
variance:
    ${variance(xs)}\
`);
