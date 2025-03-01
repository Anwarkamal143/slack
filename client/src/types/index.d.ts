type ReturnAIfNotB<A, B> = [B] extends [never] ? A : B;
