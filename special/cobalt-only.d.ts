/** @noSelfInFile */

/**
 * Loads a chunk.
 *
 * If chunk is a string, the chunk is this string. If chunk is a function, load
 * calls it repeatedly to get the chunk pieces. Each call to chunk must return a
 * string that concatenates with previous results. A return of an empty string,
 * nil, or no value signals the end of the chunk.
 *
 * If there are no syntactic errors, returns the compiled chunk as a function;
 * otherwise, returns nil plus the error message.
 *
 * If the resulting function has upvalues, the first upvalue is set to the value
 * of env, if that parameter is given, or to the value of the global
 * environment. Other upvalues are initialized with nil. (When you load a main
 * chunk, the resulting function will always have exactly one upvalue, the _ENV
 * variable (see §2.2). However, when you load a binary chunk created from a
 * function (see string.dump), the resulting function can have an arbitrary
 * number of upvalues.) All upvalues are fresh, that is, they are not shared
 * with any other function.
 *
 * chunkname is used as the name of the chunk for error messages and debug
 * information (see §4.9). When absent, it defaults to chunk, if chunk is a
 * string, or to "=(load)" otherwise.
 *
 * The string mode controls whether the chunk can be text or binary (that is, a
 * precompiled chunk). It may be the string "b" (only binary chunks), "t" (only
 * text chunks), or "bt" (both binary and text). The default is "bt".
 *
 * Lua does not check the consistency of binary chunks. Maliciously crafted
 * binary chunks can crash the interpreter.
 */
 declare function load(
    chunk: string | (() => string | null | undefined),
    chunkname?: string,
    mode?: 'b' | 't' | 'bt',
    env?: object
): LuaMultiReturn<[() => any] | [undefined, string]>;

/**
 * Similar to load, but gets the chunk from file filename or from the standard
 * input, if no file name is given.
 */
declare function loadfile(
    filename?: string,
    mode?: 'b' | 't' | 'bt',
    env?: object
): LuaMultiReturn<[() => any] | [undefined, string]>;

/**
 * Similar to load, but gets the chunk from the given string.
 *
 * To load and run a given string, use the idiom
 *
 * `assert(loadstring(s))()`
 *
 * When absent, chunkname defaults to the given string.
 */
 declare function loadstring(
    string: string,
    chunkname?: string
): LuaMultiReturn<[() => any] | [undefined, string]>;

/**
 * This function is similar to pcall, except that it sets a new message handler
 * msgh.
 *
 * xpcall calls function f in protected mode, using err as the error handler.
 * Any error inside f is not propagated; instead, xpcall catches the error,
 * calls the err function with the original error object, and returns a status
 * code. Its first result is the status code (a boolean), which is true if the
 * call succeeds without errors. In this case, xpcall also returns all results
 * from the call, after this first result. In case of any error, xpcall returns
 * false plus the result from err.
 */
 declare function xpcall<R, E>(
    f: () => R,
    err: (err: any) => E
): LuaMultiReturn<[true, R] | [false, E]>;

declare namespace math {
    /**
     * Returns the logarithm of x in the given base. The default for base is e (so
     * that the function returns the natural logarithm of x).
     */
    function log(x: number, base?: number): number;
}

declare namespace table {
    /**
     * Moves elements from table a1 to table a2, performing the equivalent to the
     * following multiple assignment: a2[t],··· = a1[f],···,a1[e]. The default for
     * a2 is a1. The destination range can overlap with the source range. The
     * number of elements to be moved must fit in a Lua integer.
     *
     * Returns the destination table a2.
     */
    function move<T1, T2 = T1>(a1: T1[], f: number, e: number, t: number, a2?: T2[]): (T2 | T1)[];
}

declare namespace string {
    /**
     * Returns a string that is the concatenation of n copies of the string s.
     */
    function rep(s: string, n: number): string;

    /**
     * Returns a string containing a binary representation (a binary chunk) of the
     * given function, so that a later load on this string returns a copy of the
     * function (but with new upvalues). If strip is a true value, the binary
     * representation may not include all debug information about the function, to
     * save space.
     *
     * Functions with upvalues have only their number of upvalues saved. When
     * (re)loaded, those upvalues receive fresh instances containing nil. (You can
     * use the debug library to serialize and reload the upvalues of a function in
     * a way adequate to your needs.)
     */
     function dump(func: Function, strip?: boolean): string;

     /**
      * Returns a binary string containing the values v1, v2, etc. packed (that is,
      * serialized in binary form) according to the format string fmt (see §6.4.2).
      */
     function pack(fmt: string, ...values: any[]): string;
 
     /**
      * Returns the values packed in string s (see string.pack) according to the
      * format string fmt (see §6.4.2). An optional pos marks where to start
      * reading in s (default is 1). After the read values, this function also
      * returns the index of the first unread byte in s.
      */
     function unpack(fmt: string, s: string, pos?: number): LuaMultiReturn<any[]>;
 
     /**
      * Returns the size of a string resulting from string.pack with the given
      * format. The format string cannot have the variable-length options 's' or
      * 'z' (see §6.4.2).
      */
     function packsize(fmt: string): number;
}

declare namespace coroutine {
    /**
     * Returns true when the running coroutine can yield.
     *
     * A running coroutine is yieldable if it is not the main thread and it is not
     * inside a non-yieldable C function.
     */
    function isyieldable(): boolean;
}

declare namespace debug {
    interface FunctionInfo<T extends Function = Function> {
        nparams: number;
        isvararg: boolean;
    }

    /**
     * This function returns the name and the value of the local variable with
     * index local of the function at level f of the stack. This function accesses
     * not only explicit local variables, but also parameters, temporaries, etc.
     *
     * The first parameter or local variable has index 1, and so on, following the
     * order that they are declared in the code, counting only the variables that
     * are active in the current scope of the function. Negative indices refer to
     * vararg parameters; -1 is the first vararg parameter. The function returns
     * nil if there is no variable with the given index, and raises an error when
     * called with a level out of range. (You can call debug.getinfo to check
     * whether the level is valid.)
     *
     * Variable names starting with '(' (open parenthesis) represent variables
     * with no known names (internal variables such as loop control variables, and
     * variables from chunks saved without debug information).
     *
     * The parameter f may also be a function. In that case, getlocal returns only
     * the name of function parameters.
     */
    function getlocal(f: Function | number, local: number): LuaMultiReturn<[string, any]>;
    function getlocal(
        thread: LuaThread,
        f: Function | number,
        local: number
    ): LuaMultiReturn<[string, any]>;

    /**
     * Returns a unique identifier (as a light userdata) for the upvalue numbered
     * n from the given function.
     *
     * These unique identifiers allow a program to check whether different
     * closures share upvalues. Lua closures that share an upvalue (that is, that
     * access a same external local variable) will return identical ids for those
     * upvalue indices.
     */
    function upvalueid(f: Function, n: number): LuaUserdata;

    /**
     * Make the n1-th upvalue of the Lua closure f1 refer to the n2-th upvalue of
     * the Lua closure f2.
     */
    function upvaluejoin(f1: Function, n1: number, f2: Function, n2: number): void;
}

/**
 * This library provides basic support for UTF-8 encoding. It provides all its
 * functions inside the table utf8. This library does not provide any support
 * for Unicode other than the handling of the encoding. Any operation that needs
 * the meaning of a character, such as character classification, is outside its
 * scope.
 *
 * Unless stated otherwise, all functions that expect a byte position as a
 * parameter assume that the given position is either the start of a byte
 * sequence or one plus the length of the subject string. As in the string
 * library, negative indices count from the end of the string.
 */
 declare namespace utf8 {
    /**
     * Receives zero or more integers, converts each one to its corresponding
     * UTF-8 byte sequence and returns a string with the concatenation of all
     * these sequences
     */
    function char(...args: number[]): string;

    /**
     * The pattern (a string, not a function) "[\0-\x7F\xC2-\xF4][\x80-\xBF]*"
     * (see §6.4.1), which matches exactly one UTF-8 byte sequence, assuming that
     * the subject is a valid UTF-8 string.
     */
    var charpattern: string;

    /**
     * Returns values so that the construction
     *
     * `for p, c in utf8.codes(s) do body end`
     *
     * will iterate over all characters in string s, with p being the position (in
     * bytes) and c the code point of each character. It raises an error if it
     * meets any invalid byte sequence.
     */
    function codes<S extends string>(
        s: S
    ): [(s: S, index?: number) => LuaMultiReturn<[number, number]>, S, 0];

    /**
     * Returns the codepoints (as integers) from all characters in s that start
     * between byte position i and j (both included). The default for i is 1 and
     * for j is i. It raises an error if it meets any invalid byte sequence.
     */
    function codepoint(s: string, i?: number, j?: number): LuaMultiReturn<number[]>;

    /**
     * Returns the number of UTF-8 characters in string s that start between
     * positions i and j (both inclusive). The default for i is 1 and for j is -1.
     * If it finds any invalid byte sequence, returns a false value plus the
     * position of the first invalid byte.
     */
    function len(s: string, i?: number, j?: number): number;

    /**
     * Returns the position (in bytes) where the encoding of the n-th character of
     * s (counting from position i) starts. A negative n gets characters before
     * position i. The default for i is 1 when n is non-negative and #s + 1
     * otherwise, so that utf8.offset(s, -n) gets the offset of the n-th character
     * from the end of the string. If the specified character is neither in the
     * subject nor right after its end, the function returns nil.
     *
     * As a special case, when n is 0 the function returns the start of the
     * encoding of the character that contains the i-th byte of s.
     *
     * This function assumes that s is a valid UTF-8 string.
     */
    function offset(s: string, n?: number, i?: number): number;
}