import {None, Some, Option} from "option.ts/index";

abstract class $Either<E, A> {
    isLeft():this is Left<E> {
        return this instanceof $Left;
    }

    isRight():this is Right<A> {
        return this instanceof $Right;
    }

    fold<B>(fe:(e:E) => B, fa:(a:A) => B):B {
        if (this.isLeft()) {
            return fe(this.unwrap());
        }
        if (this.isRight()) {
            return fa(this.unwrap());
        }
        throw new Error("UNREACHABLE");
    }

    flatMap<B>(f:(a:A) => Either<E, B>):Either<E, B> {
        return this.fold(
            e => Left(e) as Either<E, B>,
            a => f(a)
        );
    }

    getOrElse(a:A):A {
        return this.fold(
            e => a,
            a => a
        );
    }

    orElse(o:Either<E, A>):Either<E, A> {
        return this.map(a => Right(a) as Either<E, A>)
            .getOrElse(o);
    }

    swap():Either<A, E> {
        return this.fold<Either<A, E>>(
            e => Right(e),
            a => Left(a)
        );
    }

    map<B>(f:(a:A) => B):Either<E, B> {
        return this.flatMap(a =>
            Right(f(a))
        );
    }

    filter(f:(a:A) => boolean):Option<Either<E, A>> {
        return this.fold(
            _ => None,
            a => Some(a).filter(f)
        );
    }

    foreach<B>(f:(a:A) => void):void {
        return this.fold(
            _ => undefined,
            a => f(a)
        );
    }

    forall(f:(a:A) => boolean):boolean {
        return this.fold(
            _ => true,
            a => f(a)
        );
    }

    exists(f:(a:A) => boolean):boolean {
        return this.fold(
            _ => false,
            a => f(a)
        );
    }

    toString():string {
        return this.fold(
            e => `Left(${e})`,
            a => `Right(${a})`
        );
    }

    toArray():A[] {
        return this.fold(
            e => [],
            a => [a]
        );
    }
}

class $Left<E> extends $Either<E, any> {
    constructor(private e:E) {
        super();
    }

    unwrap():E {
        return this.e;
    }
}

class $Right<A> extends $Either<any, A> {
    constructor(private a:A) {
        super();
    }

    unwrap():A {
        return this.a;
    }
}

export type Left<E> =
    $Left<E>;

export type Right<A> =
    $Right<A>;

export type Either<E, A> =
    $Either<E, A>;

export function Left <E>(e:E) {
    return new $Left(e);
}

export function Right <A>(a:A) {
    return new $Right(a);
}
