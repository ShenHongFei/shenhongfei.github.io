/******/ var __webpack_modules__ = ({

/***/ 2212:
/*!*********************************!*\
  !*** ./lib/prototype.common.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AL: () => (/* binding */ rethrow),
/* harmony export */   bD: () => (/* binding */ ident),
/* harmony export */   lQ: () => (/* binding */ noop)
/* harmony export */ });
/* unused harmony exports emoji_regex, select, not_empty, empty, is_key_type, to_snake_case, to_space_case, to_method_property_descriptors, to_getter_property_descriptors, cjk, quotes, brackets, to_json, to_json_safely, byte_size, is_codepoint_fullwidth */
/* harmony import */ var emoji_regex__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! emoji-regex */ 4732);
/* harmony import */ var _platform_common_ts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./platform.common.ts */ 8179);

const emoji_regex = (0,emoji_regex__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A)();

const noop = () => { };
const ident = (x) => x;
const select = (key) => (obj) => obj[key];
/** value 不为 null 或 undefined */
const not_empty = (value) => value !== null && value !== undefined;
/** value 为 null 或 undefined */
const empty = (value) => value === undefined || value === null;
const key_types = ['string', 'number', 'symbol'];
const is_key_type = ((key) => key_types.includes(typeof key));
function rethrow(error) {
    throw error;
}
function to_snake_case(str) {
    return str.replace(/([A-Z])/g, '_$1')
        .toLowerCase()
        .replace('-', '_')
        .strip_if_start('_');
}
function to_space_case(str) {
    return str.replace(/([A-Z])/g, ' $1')
        .toLowerCase()
        .replaceAll('_', ' ')
        .strip_if_start(' ');
}
function to_method_property_descriptors(methods) {
    return Object.fromEntries(Object.entries(methods)
        .map(([name, value]) => ([name, {
            configurable: true,
            writable: true,
            enumerable: false,
            value,
        }])));
}
function to_getter_property_descriptors(getters) {
    return Object.fromEntries(Object.entries(getters)
        .map(([name, get]) => ([name, {
            configurable: true,
            enumerable: false,
            get,
        }])));
}
const cjk = '([\u2e80-\u9fff\uf900-\ufaff])';
const quotes = {
    single: "'",
    double: '"',
    backtick: '`',
};
const brackets = {
    round: ['(', ')'],
    square: ['[', ']'],
    curly: ['{', '}'],
    pointy: ['<', '>'],
    corner: ['「', '」'],
    fat: ['【', '】'],
    tortoise_shell: ['〔', '〕'],
};
globalThis.my_prototype_defined = true;
Object.defineProperties(String.prototype, {
    ...to_getter_property_descriptors({
        width() {
            const s = _platform_common_ts__WEBPACK_IMPORTED_MODULE_1__/* .platform */ .i.strip_ansi(this.replace(emoji_regex, '  '));
            let width = 0;
            for (let i = 0; i < s.length; ++i) {
                const code = s.codePointAt(i);
                if ((code <= 0x1f || (code >= 0x7f && code <= 0x9f)) || // ignore control characters
                    code >= 0x300 && code <= 0x36f // ignore combining characters
                )
                    continue;
                // surrogates
                if (code > 0xffff)
                    ++i;
                width += is_codepoint_fullwidth(code) ? 2 : 1;
            }
            return width;
        },
        // ------------ 文件路径操作
        isdir() {
            return this.endsWith('/');
        },
        fp() {
            if (!this)
                return this;
            const fp = this.replaceAll('\\', '/');
            // 转换小写盘符开头的路径
            return fp[1] === ':' && 'a' <= fp[0] && fp[0] <= 'z'
                ? fp[0].toUpperCase() + fp.slice(1)
                : fp;
        },
        fpd() {
            const { fp } = this;
            return fp.endsWith('/') ? fp : `${fp}/`;
        },
        fdir() {
            return this.fp.strip_end(this.fname);
        },
        fname() {
            const { fp } = this;
            const ilast = fp.lastIndexOf('/');
            if (ilast === -1)
                return fp; // 没有斜杠时返回整个字符串
            // 以斜杠结尾的情况
            if (ilast === fp.length - 1) {
                const iprev = fp.lastIndexOf('/', ilast - 1);
                return iprev === -1
                    ? fp // 只有一个斜杠且在末尾
                    : fp.slice(iprev + 1);
            }
            // 返回最后一个斜杠后的内容
            return fp.slice(ilast + 1);
        },
        fext() {
            if (this.endsWith('/'))
                return '';
            const { fname } = this;
            const index = fname.lastIndexOf('.');
            return index <= 0 ? '' : fname.slice(index + 1);
        }
    }),
    // ------------ 文本处理工具方法
    ...to_method_property_descriptors({
        truncate(width, storage = false) {
            if (storage)
                return this.length <= width ?
                    this
                    :
                        this.slice(0, width - 2) + '··';
            const color_bak = this.startsWith('\u001b') ? this.slice(0, 5) : '';
            const s = _platform_common_ts__WEBPACK_IMPORTED_MODULE_1__/* .platform */ .i.strip_ansi(this);
            if (width <= 2)
                return this.slice(0, width);
            let i_fitted = 0;
            let fitted_width = 0;
            let cur_width = 0;
            for (let i = 0; i < s.length; i++) {
                const code = s.codePointAt(i);
                if ((code <= 0x1F || (code >= 0x7F && code <= 0x9F)) || // Ignore control characters
                    code >= 0x300 && code <= 0x36F // Ignore combining characters
                )
                    continue;
                // surrogates (codepoint 需要用两个 utf-16 编码单位表示，因此这里跳过第二个编码单位，防止重复计算显示宽度)
                if (code > 0xFFFF)
                    i++;
                const w = is_codepoint_fullwidth(code) ? 2 : 1;
                if (cur_width + w + 2 <= width) {
                    i_fitted = i;
                    fitted_width += w;
                }
                cur_width += w;
                if (cur_width > width) {
                    const i_fitted_next = i_fitted + 1;
                    // … 在 winterm 中对不齐，使用 ·· 代替
                    const t = s.slice(0, i_fitted_next) + ' '.repeat(width - 2 - fitted_width) + '··';
                    return color_bak ? color_bak + t + '\u001b[39m' : t;
                }
            }
            return this;
        },
        pad(width, { character = ' ', position = 'right' } = {}) {
            const _width = this.width;
            if (_width >= width)
                return this;
            if (position === 'right')
                return this + character.repeat((width - _width) / character.width);
            return character.repeat(width - _width) + this;
        },
        limit(width, { character = ' ', position = 'right' } = {}) {
            return this.pad(width, { character, position }).truncate(width);
        },
        to_regexp(preservations, flags = '') {
            const preserved_chars = new Set(preservations);
            const replace_chars = Array.prototype.filter.call('|\\{}()[]^$+*?.-', (c) => !preserved_chars.has(c))
                .map((c) => c === ']' ? '\\]' : c).join('');
            return new RegExp(this.replace(new RegExp(`[${replace_chars}]`, 'g'), '\\$&'), flags);
        },
        to_snake_case() {
            return to_snake_case(this);
        },
        to_space_case() {
            return to_space_case(this);
        },
        refmt(pattern, pattern_, preservations = '', flags = '', transformer = (name, value) => value || '', pattern_placeholder = /\{.*?\}/g) {
            // --- 转换 pattern 为 pattern_regx
            let last_end = 0;
            // placeholder matched group indexes
            let $placeholders = {};
            let regx_parts = [];
            function add_part(left, right) {
                const part = pattern.slice(left, right);
                if (part)
                    regx_parts.push(part.to_regexp(preservations).source.bracket());
            }
            pattern.replace(pattern_placeholder, ($0, offset) => {
                add_part(last_end, offset);
                last_end = offset + $0.length;
                const placeholder = $0.slice(1, -1);
                let [placeholder_name, placeholder_pattern] = placeholder.split(':').map(s => s.trim());
                let optional = false;
                if (placeholder_name.endsWith('?')) {
                    placeholder_name = placeholder_name.slice(0, -1);
                    optional = true;
                }
                $placeholders[placeholder_name] = regx_parts.push(placeholder_pattern ?
                    `${placeholder_pattern.bracket()}${optional ? '?' : ''}`
                    :
                        '(.*?)');
                return '';
            });
            add_part(last_end);
            // 最后一个 (.*?) 改为贪心匹配，满足 .{suffix} 的需要
            regx_parts = regx_parts.filter(part => part);
            if (regx_parts[regx_parts.length - 1] === '(.*?)')
                regx_parts[regx_parts.length - 1] = '(.*)';
            const pattern_regx = new RegExp(regx_parts.join(''), flags);
            // --- 根据 pattern_regx 去匹配原有字符串，获取匹配结果，生成 placeholders 词典
            const matches = pattern_regx.exec(this);
            if (!matches)
                return this;
            const placeholders = Object.fromEntries(Object.entries($placeholders)
                .map(([name, $i]) => [
                [name, matches[$i]],
                [`${name}.before`, matches[$i - 1] || ''],
                [`${name}.after`, matches[$i + 1] || ''],
            ])
                .flat());
            // --- 转换 pattern_ 为 replacement_str，如果有 transformer 则在遇到 placeholder 时应用
            last_end = 0;
            let replacement_parts = [];
            pattern_.replace(pattern_placeholder, ($0, offset) => {
                replacement_parts.push(pattern_.slice(last_end, offset));
                last_end = offset + $0.length;
                const placeholder_name = $0.slice(1, -1);
                replacement_parts.push(transformer(placeholder_name, placeholders[placeholder_name], placeholders));
                return '';
            });
            replacement_parts.push(pattern_.slice(last_end));
            return this.replace(pattern_regx, replacement_parts.join(''));
        },
        find(pattern, preservations = '', flags = '', pattern_placeholder = /\{.*?\}/g) {
            // --- 转换 pattern 为 pattern_regx
            let last_end = 0;
            // placeholder matched group index
            let $placeholders = {};
            let regx_parts = [];
            function add_part(left, right) {
                const part = pattern.slice(left, right);
                if (part)
                    regx_parts.push(part.to_regexp(preservations).source.bracket());
            }
            pattern.replace(pattern_placeholder, ($0, offset) => {
                add_part(last_end, offset);
                last_end = offset + $0.length;
                const placeholder = $0.slice(1, -1);
                let [placeholder_name, placeholder_pattern] = placeholder.split(':').map(s => s.trim());
                let optional = false;
                if (placeholder_name.endsWith('?')) {
                    placeholder_name = placeholder_name.slice(0, -1);
                    optional = true;
                }
                $placeholders[placeholder_name] = regx_parts.push(placeholder_pattern ?
                    `${placeholder_pattern.bracket()}${optional ? '?' : ''}`
                    :
                        '(.*?)');
                return '';
            });
            add_part(last_end);
            // 最后一个 (.*?) 改为贪心匹配，满足 .{suffix} 的需要
            regx_parts = regx_parts.filter(part => part);
            if (regx_parts[regx_parts.length - 1] === '(.*?)')
                regx_parts[regx_parts.length - 1] = '(.*)';
            const pattern_regx = new RegExp(regx_parts.join(''), flags);
            // --- 根据 pattern_regx 去匹配原有字符串，获取匹配结果，生成 placeholders 词典
            const matches = pattern_regx.exec(this);
            if (!matches)
                return {};
            return Object.fromEntries(Object.entries($placeholders)
                .map(([name, $i]) => [name, matches[$i] || '']));
        },
        /** 查找子串或字符出现的次数 */
        count(search) {
            if (!search)
                throw new Error('count 的 search 不能为空');
            let count = 0;
            for (let i = 0; (i = this.indexOf(search, i)) !== -1; i += search.length)
                count++;
            return count;
        },
        quote(type = 'single') {
            if (type === 'psh')
                return `& ${this.quote()}`;
            return this.surround(quotes[type]);
        },
        bracket(shape = 'round') {
            return this.surround(...brackets[shape]);
        },
        surround(left, right) {
            return left + this + (right || left);
        },
        surround_tag(tag_name) {
            return '<' + tag_name + '>' + this + '</' + tag_name + '>';
        },
        to_lf() {
            return this.replace(/\r\n/g, '\n');
        },
        rm(pattern, flags = 'g') {
            if (typeof pattern === 'string')
                pattern = new RegExp(pattern, flags);
            return this.replace(pattern, '');
        },
        split_lines(delimiter = /\r?\n/) {
            let lines = this.split(delimiter);
            if (lines[lines.length - 1] === '')
                lines.pop();
            return lines;
        },
        split_indent() {
            let i = 0;
            let indent = 0;
            for (; i < this.length; i++)
                if (this[i] === ' ')
                    indent++;
                else if (this[i] === '\t')
                    indent += 4;
                else
                    break;
            return {
                indent,
                text: this.slice(i)
            };
        },
        split2(splitter, { last = false, optional = false } = {}) {
            const isplitter = last ? this.lastIndexOf(splitter) : this.indexOf(splitter);
            if (isplitter === -1)
                if (optional)
                    return [this];
                else
                    throw new Error(`字符串: ${this} 必须包含 splitter: ${splitter}`);
            return [this.slice(0, isplitter), this.slice(isplitter + splitter.length)];
        },
        strip_start(prefix, validate) {
            if (validate && !this.startsWith(prefix))
                throw new Error(`字符串没有以前缀 ${prefix} 开头: ${this}`);
            return this.slice(prefix.length);
        },
        strip_if_start(prefix) {
            return this.startsWith(prefix) ? this.slice(prefix.length) : this;
        },
        strip_end(suffix, validate) {
            if (validate && !this.endsWith(suffix))
                throw new Error(`字符串没有以后缀 ${suffix} 结尾: ${this}`);
            return this.slice(0, -suffix.length);
        },
        strip_if_end(suffix) {
            return this.endsWith(suffix) ? this.slice(0, -suffix.length) : this;
        },
        ensure_start(prefix) {
            return this.startsWith(prefix) ? this : prefix + this;
        },
        ensure_end(suffix = '\n') {
            return this.endsWith(suffix) ? this : this + suffix;
        },
        slice_from(search, { include = false, last = false, optional = false } = {}) {
            const i = last ? this.lastIndexOf(search) : this.indexOf(search);
            if (i === -1)
                if (optional)
                    return this;
                else
                    throw new Error(`slice_from 在字符串 ${this} 中找不到 search: ${search}`);
            else
                return this.slice(include ? i : i + search.length);
        },
        slice_to(search, { include = false, last = false, optional = false } = {}) {
            const i = last ? this.lastIndexOf(search) : this.indexOf(search);
            if (i === -1)
                if (optional)
                    return this;
                else
                    throw new Error(`slice_to 在字符串 ${this} 中找不到 search: ${search}`);
            else
                return this.slice(0, include ? i + search.length : i);
        },
        space() {
            if (!this)
                return this;
            let text_;
            text_ = this
                .replace(space_patterns[0], '$1 $2')
                .replace(space_patterns[1], '$1 $2')
                .replace(space_patterns[2], '$1$2$3')
                .replace(space_patterns[3], '$1 $2 $3')
                .replace(space_patterns[4], '$1 $2 $3');
            const text_bak = text_;
            text_ = text_.replace(space_patterns[5], '$1 $2 $4');
            if (text_ === text_bak)
                text_ = text_
                    .replace(space_patterns[6], '$1 $2')
                    .replace(space_patterns[7], '$1 $2');
            return text_
                .replace(space_patterns[8], '$1$3$5')
                .replace(space_patterns[9], '$1$2 $3')
                .replace(space_patterns[10], '$1 $2')
                .replace(space_patterns[11], '$1 $2');
        }
    })
});
const space_patterns = [
    new RegExp(cjk + '([\'"])', 'g'),
    new RegExp('([\'"])' + cjk, 'g'),
    /(["']+)\s*(.+?)\s*(["']+)/g,
    new RegExp(cjk + '([\\+\\-\\*\\/=&\\\\\\|<>])([A-Za-z0-9])', 'g'),
    new RegExp('([A-Za-z0-9])([\\+\\-\\*\\/=&\\\\\\|<>])' + cjk, 'g'),
    new RegExp(cjk + '([\\(\\[\\{<\u201c]+(.*?)[\\)\\]\\}>\u201d]+)' + cjk, 'g'),
    new RegExp(cjk + '([\\(\\[\\{<\u201c>])', 'g'),
    new RegExp('([\\)\\]\\}>\u201d<])' + cjk, 'g'),
    /([\(\[\{<\u201c]+)(\s*)(.+?)(\s*)([\)\]\}>\u201d]+)/g,
    new RegExp(cjk + '([~!;:,\\.\\?\u2026])([A-Za-z0-9])', 'g'),
    new RegExp(cjk + '([A-Za-z0-9`\\$%\\^&\\*\\-=\\+\\\\\\|\\/@\u00a1-\u00ff\u2022\u2027\u2150-\u218f])', 'g'),
    new RegExp('([A-Za-z0-9`\\$%\\^&\\*\\-=\\+\\\\\\|\\/@\u00a1-\u00ff\u2022\u2027\u2150-\u218f])' + cjk, 'g')
];
Object.defineProperties(Date.prototype, to_method_property_descriptors({
    to_str(ms) {
        return `${this.to_date_str()} ${this.to_time_str(ms)}`;
    },
    to_date_str() {
        // 2024.01.01
        return this.getFullYear() + '.' +
            String(this.getMonth() + 1).padStart(2, '0') + '.' +
            String(this.getDate()).padStart(2, '0');
    },
    to_time_str(ms) {
        // 早上 09:00:00
        const [ampm, hour] = get_twelve_hour_clock(this);
        return `${ampm} ${get_time_str(this, hour, ms, ':')}`;
    },
    to_dot_time_str(ms) {
        // 17.03.02
        return get_time_str(this, this.getHours(), ms, '.');
    },
    to_dot_str(ms) {
        return `${this.to_date_str()} ${this.to_dot_time_str(ms)}`;
    },
    to_formal_time_str(ms) {
        // 17:03:02
        return get_time_str(this, this.getHours(), ms, ':');
    },
    to_formal_str(ms) {
        return `${this.to_date_str()} ${this.to_formal_time_str(ms)}`;
    }
}));
function get_twelve_hour_clock(date) {
    let hour = date.getHours();
    if (hour <= 6)
        return ['凌晨', hour];
    if (hour <= 8)
        return ['清晨', hour];
    if (hour <= 9)
        return ['早上', hour];
    if (hour <= 10)
        return ['上午', hour];
    if (hour <= 12)
        return ['中午', hour];
    hour -= 12;
    if (hour <= 5)
        return ['下午', hour];
    if (hour <= 10)
        return ['晚上', hour];
    return ['深夜', hour];
}
function get_time_str(date, hour, ms, splitter) {
    return String(hour).padStart(2, '0') + splitter +
        String(date.getMinutes()).padStart(2, '0') + splitter +
        String(date.getSeconds()).padStart(2, '0') +
        (ms
            ? '.' + String(date.getMilliseconds()).padStart(3, '0')
            : '');
}
Object.defineProperties(Number.prototype, to_method_property_descriptors({
    to_fsize_str() {
        return byte_size(this);
    },
    to_bin_str() {
        return `0b${this.toString(2)}`;
    },
    to_hex_str(length) {
        const s = Math.abs(this).toString(16);
        // 长度自动对齐到 4 的倍数
        if (length === undefined)
            length = Math.ceil(s.length / 4) * 4;
        return `${this < 0 ? '-' : ''}0x${'0'.repeat(length - s.length)}${s}`;
    },
    to_oct_str() {
        return `0o${this.toString(8)}`;
    },
}));
Object.defineProperties(Array.prototype, {
    ...to_getter_property_descriptors({
        last() {
            return this.at(-1);
        }
    }),
    ...to_method_property_descriptors({
        trim_lines({ trim_line = true, rm_empty_lines = true, rm_last_empty_lines = false } = {}) {
            if (!this.length)
                return this;
            let lines = this;
            if (trim_line)
                lines = lines.map(line => line.trim());
            if (rm_empty_lines)
                return lines.filter(Boolean);
            if (rm_last_empty_lines) {
                const index = lines.findLastIndex(Boolean);
                return index === -1 ? [] : lines.slice(0, index + 1);
            }
            return lines;
        },
        indent(width = 4, character = ' ') {
            const indent = character.repeat(width);
            return this.map(line => indent + line);
        },
        sum(zero, mapper) {
            if (!this.length)
                return undefined;
            // 快捷路径
            const first = this[0];
            if ((typeof first === 'number' || typeof first === 'bigint') && !mapper)
                return this.reduce((acc, x) => acc + x, zero);
            if (is_key_type(mapper))
                mapper = select(mapper);
            mapper ??= ident;
            return this.reduce((acc, x) => acc + mapper(x), zero);
        },
        max(mapper = ident) {
            if (!this.length)
                return undefined;
            if (is_key_type(mapper))
                mapper = select(mapper);
            let max = mapper(this[0]);
            let imax = 0;
            for (let i = 0; i < this.length; i++) {
                const value = mapper(this[i]);
                if (value > max) {
                    max = value;
                    imax = i;
                }
            }
            return this[imax];
        },
        min(mapper = ident) {
            if (!this.length)
                return undefined;
            if (is_key_type(mapper))
                mapper = select(mapper);
            let min = mapper(this[0]);
            let imin = 0;
            for (let i = 0; i < this.length; i++) {
                const value = mapper(this[i]);
                if (value < min) {
                    min = value;
                    imin = i;
                }
            }
            return this[imin];
        },
        unique(mapper) {
            if (!mapper)
                return [...new Set(this)];
            if (is_key_type(mapper))
                mapper = select(mapper);
            let map = new Map();
            for (const x of this)
                map.set(mapper(x), x);
            return [...map.values()];
        },
        join_lines(append = Boolean(this.length)) {
            return `${this.join('\n')}${append ? '\n' : ''}`;
        },
        select(key) {
            return this.map(select(key));
        }
    })
});
Object.defineProperties(BigInt.prototype, to_method_property_descriptors({
    to_fsize_str() {
        return byte_size(this);
    },
    toJSON() {
        return this.toString();
    }
}));
Object.defineProperties(Error.prototype, to_method_property_descriptors({
    toJSON() {
        return Object.fromEntries(Object.getOwnPropertyNames(this)
            .map(name => [name, this[name]]));
    }
}));
Object.defineProperties(Set.prototype, to_method_property_descriptors({
    map(mapfn) {
        return Array.from(this, mapfn);
    }
}));
Object.defineProperties(Uint8Array.prototype, to_getter_property_descriptors({
    dataview() {
        return new DataView(this.buffer, this.byteOffset, this.byteLength);
    }
}));
function to_json(obj, replacer) {
    return JSON.stringify(obj, replacer, 4) + '\n';
}
function to_json_safely(obj, replacer) {
    return to_json(obj, replacer)
        .replace(/\u2028/g, '\\u2028')
        .replace(/\u2029/g, '\\u2029')
        .replace(/<\/script>/g, '<\\/script>');
}
const units = ['b', 'kb', 'mb', 'gb', 'tb', 'pb', 'eb', 'zb', 'yb'];
const bytes_table = units.map((unit, i) => ({
    start: i === 0 ? 0 : 2 ** (i * 10),
    end: 2 ** ((i + 1) * 10),
    unit
}));
function byte_size(bytes) {
    bytes = Number(bytes);
    if (Number.isNaN(bytes)) {
        console.error(new Error('Number.byte_size() 不能传入 NaN'));
        return '';
    }
    const sign = bytes < 0 ? '-' : '';
    bytes = Math.abs(bytes);
    const { unit, start } = bytes_table.find(range => range.start <= bytes && bytes < range.end);
    return `${sign}${(start === 0 ? bytes : bytes / start).toFixed()} ${unit}`;
}
function is_codepoint_fullwidth(codepoint) {
    // code points are derived from:
    // http://www.unix.org/Public/UNIDATA/EastAsianWidth.txt
    return (!Number.isNaN(codepoint) &&
        codepoint >= 0x1100 &&
        (codepoint <= 0x115f || // hangul jamo
            codepoint === 0x201c || codepoint === 0x201d || // 
            codepoint === 0x2026 || // …
            codepoint === 0x203b || // ※
            // arrows
            (0x2190 <= codepoint && codepoint <= 0x21FF) ||
            codepoint === 0x2329 || // left-pointing angle bracket
            codepoint === 0x232a || // right-pointing angle bracket
            // ①
            (0x2460 <= codepoint && codepoint <= 0x24ff) ||
            // box drawing
            (0x2500 <= codepoint && codepoint <= 0x257f) ||
            // shapes, symbols, …
            (0x2580 <= codepoint && codepoint <= 0x2bef) ||
            // cjk radicals supplement .. enclosed cjk letters and months
            (0x2e80 <= codepoint && codepoint <= 0x3247 && codepoint !== 0x303f) ||
            // enclosed cjk letters and months .. cjk unified ideographs extension a
            (0x3250 <= codepoint && codepoint <= 0x4dbf) ||
            // cjk unified ideographs .. yi radicals
            (0x4E00 <= codepoint && codepoint <= 0xA4C6) ||
            // hangul jamo extended-a
            (0xa960 <= codepoint && codepoint <= 0xa97c) ||
            // hangul syllables
            (0xac00 <= codepoint && codepoint <= 0xd7a3) ||
            // cjk compatibility ideographs
            (0xf900 <= codepoint && codepoint <= 0xfaff) ||
            // vertical forms
            (0xfe10 <= codepoint && codepoint <= 0xfe19) ||
            // cjk compatibility forms .. small form variants
            (0xfe30 <= codepoint && codepoint <= 0xfe6b) ||
            // halfwidth and fullwidth forms
            (0xff01 <= codepoint && codepoint <= 0xff60) ||
            (0xffe0 <= codepoint && codepoint <= 0xffe6) ||
            // kana supplement
            (0x1b000 <= codepoint && codepoint <= 0x1b001) ||
            // enclosed ideographic supplement
            (0x1f200 <= codepoint && codepoint <= 0x1f251) ||
            // cjk unified ideographs extension b .. tertiary ideographic plane
            (0x20000 <= codepoint && codepoint <= 0x3fffd)));
}


/***/ }),

/***/ 2702:
/*!******************************!*\
  !*** ./lib/utils.browser.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   cb: () => (/* reexport safe */ _utils_common_ts__WEBPACK_IMPORTED_MODULE_2__.cb),
/* harmony export */   vA: () => (/* reexport safe */ _utils_common_ts__WEBPACK_IMPORTED_MODULE_2__.vA),
/* harmony export */   z6: () => (/* reexport safe */ _utils_common_ts__WEBPACK_IMPORTED_MODULE_2__.z6)
/* harmony export */ });
/* unused harmony exports pause, required, switch_selecteds, apply_css, to_option, download_url, download, load_script */
/* harmony import */ var _prototype_browser_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./prototype.browser.ts */ 6213);
/* harmony import */ var _platform_browser_ts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./platform.browser.ts */ 3416);
/* harmony import */ var _utils_common_ts__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils.common.ts */ 4701);




async function pause(milliseconds = 3000) {
    await (0,_utils_common_ts__WEBPACK_IMPORTED_MODULE_2__/* .delay */ .cb)(milliseconds);
    debugger;
}
globalThis.pause = pause;
/** 表单 Form.Item 必填 `<Form.Item {...required}>` */
const required = { required: true, rules: [{ required: true }] };
/** 切换所有已选择的 items 中是否包含当前 item */
function switch_selecteds(selecteds, item) {
    return selecteds.includes(item) ?
        selecteds.filter(s => s !== item)
        :
            [...selecteds, item];
}
function apply_css(css) {
    let $style = document.createElement('style');
    $style.appendChild(document.createTextNode(css));
    document.head.appendChild($style);
}
function to_option(value) {
    return { label: value, value };
}
function download_url(name, url) {
    // 创建一个隐藏的 <a> 元素
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = name;
    // 将 <a> 元素添加到 DOM 中
    document.body.appendChild(a);
    // 触发下载
    a.click();
    // 下载完成后移除 <a> 元素和 URL 对象
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
function download(name, data, mime_type) {
    download_url(name, URL.createObjectURL(new Blob([data], { type: mime_type })));
}
async function load_script(url, type) {
    return new Promise((resolve, reject) => {
        let $script = document.createElement('script');
        $script.src = url;
        $script.async = true;
        $script.onload = resolve;
        $script.onerror = reject;
        if (type)
            $script.type = type;
        document.head.appendChild($script);
    });
}


/***/ }),

/***/ 3416:
/*!*********************************!*\
  !*** ./lib/platform.browser.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

/* harmony import */ var _platform_common_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./platform.common.ts */ 8179);
/* harmony import */ var _prototype_common_ts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./prototype.common.ts */ 2212);
/* harmony import */ var _utils_common_ts__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils.common.ts */ 4701);




function get_buffer(length) {
    return new Uint8Array(length);
}
function encode(str) {
    return _utils_common_ts__WEBPACK_IMPORTED_MODULE_2__/* .encoder */ .Rd.encode(str);
}
async function delay(milliseconds, { signal } = {}) {
    signal?.throwIfAborted();
    return new Promise((resolve, reject) => {
        function on_signal_abort() {
            clearTimeout(timeout);
            reject(signal.reason);
        }
        signal?.addEventListener('abort', on_signal_abort);
        let timeout = setTimeout(() => {
            signal?.removeEventListener('abort', on_signal_abort);
            resolve();
        }, milliseconds);
    });
}
(0,_platform_common_ts__WEBPACK_IMPORTED_MODULE_0__/* .set_platform */ .P)({
    nodejs: false,
    browser: true,
    get_buffer,
    encode,
    delay,
    strip_ansi: _prototype_common_ts__WEBPACK_IMPORTED_MODULE_1__/* .ident */ .bD,
    get_websocket() {
        return globalThis.WebSocket;
    },
    get_https_proxy_agent() {
        return null;
    }
});


/***/ }),

/***/ 4688:
/*!****************************!*\
  !*** ./lib/net.browser.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Em: () => (/* binding */ request),
/* harmony export */   bL: () => (/* binding */ request_json)
/* harmony export */ });
/* unused harmony export rpc */
/* harmony import */ var _utils_browser_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.browser.ts */ 2702);
/* harmony import */ var _net_common_ts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./net.common.ts */ 8779);



async function fetch_retry(url, options, timeout, retries = 0, count = 0) {
    try {
        options.signal = AbortSignal.timeout(timeout);
        return await fetch(url, options);
    }
    catch (error) {
        if (count >= retries ||
            error.name !== 'TimeoutError' && !['ECONNRESET', 'ETIMEDOUT', 'ESOCKETTIMEDOUT'].includes(error.cause?.code))
            throw error;
        else {
            const duration = 2 ** count;
            console.log(`等待 ${duration} 秒后重试 fetch (${count}) …  ${url.toString()}`);
            await (0,_utils_browser_ts__WEBPACK_IMPORTED_MODULE_0__/* .delay */ .cb)(1000 * duration);
            return fetch_retry(url, options, timeout, retries, count + 1);
        }
    }
}
async function request(url, options = {}) {
    const { queries, headers: _headers, body, type = 'application/json', encoding, timeout = 5 * 1000, auth, cors, raw = false, full = false, credentials = 'include', } = options;
    let { method, retries, } = options;
    url = new URL(url, location.href);
    if (queries)
        for (const key in queries) {
            let value = queries[key];
            if (typeof value === 'boolean')
                value = value ? '1' : '0';
            url.searchParams.append(key, value);
        }
    if (body !== undefined && !method)
        method = 'POST';
    if (retries === true)
        retries = 2;
    // --- headers, http/2 开始都用小写的 headers
    let headers = new Headers();
    if (body !== undefined)
        headers.set('content-type', type);
    if (auth)
        headers.set('authorization', auth.type === 'basic' ? `Basic ${`${auth.username}:${auth.password}`.to_base64()}` : `Bearer ${auth.token}`);
    if (_headers)
        if (_headers instanceof Headers)
            // @ts-ignore: ts 类型不支持，实际上已经有了
            for (const [key, value] of _headers) {
                if (!key.startsWith(':') && !key.startsWith('sec-') && !_net_common_ts__WEBPACK_IMPORTED_MODULE_1__/* .drop_request_headers */ .pV.has(key))
                    headers.set(key, value);
            }
        else
            for (const key in _headers)
                if (!key.startsWith(':') && !key.startsWith('sec-') && !_net_common_ts__WEBPACK_IMPORTED_MODULE_1__/* .drop_request_headers */ .pV.has(key)) { // 可能在 http/2 的 response 中会有这样开头的保留 headers, 在透传时忽略比较好
                    (0,_utils_browser_ts__WEBPACK_IMPORTED_MODULE_0__/* .assert */ .vA)(key === key.toLowerCase(), `传入 request 的 headers 参数中 key 应该都是小写的，实际为 ${key}`);
                    headers.set(key, _headers[key]);
                }
    let fetch_options = {
        ...method ? { method } : {},
        keepalive: true,
        redirect: 'follow',
        credentials,
        ...cors ? { mode: 'cors' } : {},
        headers,
        // --- body
        body: get_request_body(body, type),
    };
    let response;
    try {
        response = await fetch_retry(url, fetch_options, timeout, retries);
        if (!response.ok)
            throw Object.assign(new Error(`状态码 ${response.status}, 非 2xx: ${url}`), { name: 'StatusCodeError' });
    }
    catch (error) {
        ;
        error.url = url;
        error.options = options;
        if (response)
            error.response = {
                status: response.status,
                headers: response.headers,
                body: await response.text(),
            };
        throw error;
    }
    if (raw)
        return response;
    const body_ = await get_response_body(response, encoding);
    return full ?
        { status: response.status, headers: response.headers, body: body_ }
        :
            body_;
}
function get_request_body(body, type) {
    if (body === undefined)
        return;
    if (type === 'application/json') {
        return typeof body === 'string' ||
            ArrayBuffer.isView(body) ||
            body instanceof ArrayBuffer ||
            body instanceof Blob ?
            body
            :
                JSON.stringify(body);
    }
    if (type === 'application/x-www-form-urlencoded')
        return body instanceof URLSearchParams ? body : new URLSearchParams(body);
    (0,_utils_browser_ts__WEBPACK_IMPORTED_MODULE_0__/* .check */ .z6)(type === 'multipart/form-data');
    if (body instanceof FormData)
        return body;
    let form = new FormData();
    for (const key in body) {
        let value = body[key];
        form.set(key, value);
    }
    return form;
}
async function get_response_body(response, encoding) {
    if (!response.body)
        return encoding === 'binary' ? new ArrayBuffer(0) : '';
    if (encoding === 'binary')
        return response.arrayBuffer();
    return response.text();
}
/** 发起 http 请求并将响应体作为 json 解析 */
async function request_json(url, options) {
    const body = await request(url, options);
    if (!body)
        return;
    try {
        return JSON.parse(body);
    }
    catch (error) {
        console.error(body);
        throw error;
    }
}
// ------------------------------------ rpc
/** post json to /repl/rpc
    - func: 函数名
    - args?: 参数数组
    - options?:
        - local?: `false` 为 true 时 url 为 `${location.protocol}//localhost/repl/rpc`;  false 时 url 为 '/repl/rpc'
        - ignore?: `false` 等待执行，但不将结果序列化写入 response 返回
        - async?: `false` 不等待执行
*/
async function rpc(func, args, { local, ignore, async: _async, } = {}) {
    if (!func)
        throw new Error('rpc 参数错误: 未传 func');
    return request_json((() => {
        const { protocol } = location;
        if (protocol === 'chrome-extension:' || protocol === 'vscode-webview:')
            return 'http://localhost';
        if (!local)
            return '';
        return `${protocol}//localhost`;
    })() + '/repl/rpc', {
        body: {
            func,
            args,
            async: _async,
            ignore,
        }
    });
}


/***/ }),

/***/ 4701:
/*!*****************************!*\
  !*** ./lib/utils.common.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   D4: () => (/* binding */ decode),
/* harmony export */   GW: () => (/* binding */ genid),
/* harmony export */   KZ: () => (/* binding */ encode_into),
/* harmony export */   MU: () => (/* binding */ TimeoutError),
/* harmony export */   O6: () => (/* binding */ seq),
/* harmony export */   Rd: () => (/* binding */ encoder),
/* harmony export */   ax: () => (/* binding */ ceil2),
/* harmony export */   c_: () => (/* binding */ Lock),
/* harmony export */   cb: () => (/* binding */ delay),
/* harmony export */   gk: () => (/* binding */ set_error_message),
/* harmony export */   v6: () => (/* binding */ defer),
/* harmony export */   vA: () => (/* binding */ assert),
/* harmony export */   wR: () => (/* binding */ timeout),
/* harmony export */   z6: () => (/* binding */ check)
/* harmony export */ });
/* unused harmony exports log, unique, strcmp, sort_keys, vercmp, zip_object, map_keys, get_key_mapper, map_values, filter_keys, filter_values, pick, omit, concat, encode, buffer_equals, poll, fuzzyfilter, get, global_get, invoke, delta2str, datetime_format, date_format, time_format, Timer, defer2, grep, lowercase_first_letter, throttle, debounce, tomorrow, to_csv_field, array_equals, nowstr */
/* harmony import */ var _prototype_common_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./prototype.common.ts */ 2212);
/* harmony import */ var _platform_common_ts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./platform.common.ts */ 8179);


async function delay(milliseconds, options) {
    return _platform_common_ts__WEBPACK_IMPORTED_MODULE_1__/* .platform */ .i.delay(milliseconds, options);
}
function assert(assertion, message) {
    if (!assertion) {
        debugger;
        throw new Error(`断言失败: ${message ? `${message}: ` : ''}`);
    }
    return assertion;
}
/** 做参数校验，逻辑检查 */
function check(condition, message) {
    if (!condition) {
        debugger;
        throw new Error(message || '检查失败');
    }
    return condition;
}
/** 生成随机 id (number) */
function genid() {
    return Math.random() * 2 ** 53;
}
function log(...args) {
    if (args.length === 2) {
        const [label, obj] = args;
        console.log(label, obj);
        return obj;
    }
    else {
        const obj = args[0];
        console.log(obj);
        return obj;
    }
}
/** 生成 0, 1, ..., n - 1 (不包括 n) 的数组，支持传入 generator 函数，通过 index 生成各个元素
    @example seq(10, i => `item-${i}`) */
function seq(n, generator) {
    let a = new Array(n);
    for (let i = 0; i < n; i++)
        a[i] = generator ? generator(i) : i;
    return a;
}
/** 数组或 iterable 去重（可按 mapper 选择或计算某个值来去重），重复值保留最后出现的那个
    - mapper?: 可以是 key (string, number, symbol) 或 (obj: any) => any */
function unique(iterable, mapper) {
    if (!mapper)
        return [...new Set(iterable)];
    if (is_key_type(mapper))
        mapper = select(mapper);
    let map = new Map();
    for (const x of iterable)
        map.set(mapper(x), x);
    return [...map.values()];
}
/** 字符串字典序比较 */
function strcmp(l, r) {
    if (l === r)
        return 0;
    if (l < r)
        return -1;
    return 1;
}
/** 排序对象中 keys 的顺序，返回新的对象 */
function sort_keys(obj) {
    return Object.fromEntries(Object.entries(obj)
        .sort(([key_l], [key_r]) => strcmp(key_l, key_r)));
}
/** 比较 1.10.02 这种版本号
    - l, r: 两个版本号字符串
    - loose?: `false` 宽松模式，允许两个版本号格式（位数）不一致 */
function vercmp(l, r, loose = false) {
    const lparts = l.split('.').map(x => Number(x));
    const rparts = r.split('.').map(x => Number(x));
    if (!loose && lparts.length !== rparts.length)
        throw new Error('传入 vercmp 的两个版本号格式不一致');
    const minlen = Math.min(lparts.length, rparts.length);
    for (let i = 0; i < minlen; ++i) {
        const l = lparts[i];
        const r = rparts[i];
        check(!isNaN(l) && !isNaN(r), '传入 vercmp 的版本非法');
        if (l !== r)
            return l - r;
    }
    // loose 下按短的优先，否则应该一样，为 0
    return lparts.length - rparts.length;
}
/** 将 keys, values 数组按对应的顺序组合成一个对象 */
function zip_object(keys, values) {
    return keys.reduce((obj, key, i) => {
        obj[key] = values[i];
        return obj;
    }, {});
}
/** 映射对象中的 keys, 返回新对象
    - obj: 对象
    - mapper?: `to_snake_case` (key: string) => string 或者 Record<string, string> 一对一映射键
    - overrider?: 添加一些键到返回的新对象上 */
function map_keys(obj, mapper = to_snake_case, overrider) {
    const obj_ = Object.fromEntries(Object.entries(obj)
        .map(typeof mapper === 'function' ?
        ([key, value]) => [mapper(key), value]
        :
            ([key, value]) => [mapper[key] || key, value]));
    return (overrider ? { ...obj_, ...overrider(obj_) } : obj_);
}
/** 返回一个映射对象 keys 的函数，通常和 .map 函数一起使用 */
function get_key_mapper(mapper, overrider) {
    return (obj) => map_keys(obj, mapper, overrider);
}
/** 映射对象中的 values, 返回新对象 */
function map_values(obj, mapper) {
    return Object.fromEntries(Object.entries(obj)
        .map(([key, value]) => [key, mapper(value, key)]));
}
/** 过滤对象中的 keys, 返回新对象 */
function filter_keys(obj, filter) {
    return Object.fromEntries(Object.entries(obj)
        .filter(([key]) => filter(key)));
}
/** 过滤对象中的 values, 返回新对象
    - obj
    - filter?: `not_empty` */
function filter_values(obj, filter = not_empty) {
    return Object.fromEntries(Object.entries(obj)
        .filter(([, value]) => filter(value)));
}
/** 简单选择对象中的部分 keys, 返回新对象 */
function pick(obj, keys) {
    return keys.reduce((acc, key) => {
        acc[key] = obj[key];
        return acc;
    }, {});
}
/** 忽略对象中的 keys, 返回新对象 */
function omit(obj, omit_keys) {
    const set = omit_keys instanceof Set;
    return filter_keys(obj, set ?
        key => !(omit_keys.has(key))
        :
            key => !(omit_keys.includes(key)));
}
/** 拼接 TypedArrays 生成一个完整的 Uint8Array */
function concat(arrays) {
    let length = 0;
    for (const a of arrays)
        length += a.byteLength;
    let buf = platform.get_buffer(length);
    let offset = 0;
    for (const a of arrays) {
        const uint8view = new Uint8Array(a.buffer, a.byteOffset, a.byteLength);
        buf.set(uint8view, offset);
        offset += uint8view.byteLength;
    }
    return buf;
}
let encoder = new TextEncoder();
/** 将字符串简单的编码为 utf-8 的 buffer (Uint8Array)。高频使用或者在流式处理时，考虑使用 TextEncoder 的 encodeInto 方法 */
function encode(str) {
    return platform.encode(str);
}
function encode_into(str, buf) {
    // 这个是直接用 v8 String::WriteUtf8 最高效的方法了
    return encoder.encodeInto(str, buf);
}
let decoder = new TextDecoder();
/** 将 utf-8 buffer (Uint8Array) 简单的解码为 string。
    在流式处理 (buffer 可能不完整) 时，应使用独立的 TextDecoder 实例调用 decode(buffer, { stream: true }) */
function decode(buffer) {
    return decoder.decode(buffer);
}
/** 比较两个 buffer 内容是否相同，第二个可以传入 string 自动编码转换后比较，
    高频调用时建议提前编码 right 并缓存 */
function buffer_equals(left, right) {
    if (typeof right === 'string')
        right = encode(right);
    if (left.length !== right.length)
        return false;
    for (let i = 0; i < left.length; i++)
        if (left[i] !== right[i])
            return false;
    return true;
}
/** 在指定的时间 (milliseconds) 内运行某个任务，超时之后抛出错误或调用 on_timeout
    - milliseconds: 限时毫秒数
    - action?: 要等待运行的任务, async function 或 promise
    - on_timeout?: 超时后调用的函数，或者设置错误消息
        - 若传:
            - 传 string: 作为 TimeoutError 的 error message
            - 传 function: 超时时调用会调用 on_timeout，参数为 TimeoutError，然后等待 on_timeout 执行完成
                - on_timeout 函数正常运行: timeout 函数返回 null
                - on_timeout 报错: timeout 函数最终抛出这个错误
        - 若不传: 直接抛出 TimeoutError
    - print?: `true` 打印已超时任务的错误 */
function timeout(milliseconds, action, on_timeout, print = true) {
    const error = new TimeoutError(typeof on_timeout === 'string' ? on_timeout : undefined);
    let presult = defer2();
    let waiting_on_timeout = false;
    let timeout = setTimeout(async () => {
        if (typeof on_timeout === 'function')
            try {
                waiting_on_timeout = true;
                await on_timeout(error);
                presult.resolve(null);
            }
            catch (error) {
                presult.reject(error);
            }
        else
            presult.reject(error);
    }, milliseconds);
    const paction = typeof action === 'function' ? action() : action;
    paction.then(result => {
        if (presult.settled) {
            if (print)
                console.log('已超时任务最终完成了:', result);
        }
        else if (!waiting_on_timeout) {
            presult.resolve(result);
            clearTimeout(timeout);
        }
    }, error => {
        if (presult.settled) {
            if (print)
                console.error(`已超时任务的错误: ${error.message}`);
        }
        else if (!waiting_on_timeout) {
            presult.reject(error);
            clearTimeout(timeout);
        }
    });
    return presult;
}
/** 轮询尝试 action 共 times 次，每次间隔 duration
    action 返回 trusy 值时认为成功，返回 action 的结果
    如果次数用尽仍然失败，返回 null */
async function poll(duration, times, action) {
    let break_flag = false;
    function _break() {
        break_flag = true;
    }
    for (let i = 0; i < times; ++i) {
        const result = await action(_break);
        if (result)
            return result;
        if (break_flag)
            break;
        await delay(duration);
    }
    return null;
}
/** 模糊过滤字符串列表或对象列表，常用于根据用户输入补全或搜索过滤
    如果有完全匹配关键词的，只返回完全匹配关键词的候选项
    - query: 查询字符串，要求为全小写
    - items: TItem[], 要过滤的列表
    - keywords: string[][] 每个 item 对应一个全小写字符串的关键词数组，用于实际筛选匹配 */
function fuzzyfilter(query, items, keywords, single_char_startswith = false) {
    if (!query)
        return items;
    if (!items.length)
        return [];
    const query_lower = query.toLowerCase();
    let fullmatches = [];
    keywords.forEach((words, index) => {
        if (words.includes(query_lower))
            fullmatches.push(items[index]);
    });
    if (fullmatches.length)
        return fullmatches;
    if (single_char_startswith && query.length === 1) {
        const c = query[0];
        return items.filter((_, i) => keywords[i].some(x => x.startsWith(c)));
    }
    return items.filter((_, i) => {
        for (const str_lower of keywords[i]) {
            let j = 0;
            let not_found = false;
            for (const c of query_lower) {
                j = str_lower.indexOf(c, j) + 1;
                if (!j) { // 找不到则 j === 0
                    not_found = true;
                    break;
                }
            }
            if (!not_found)
                return true;
        }
        return false;
    });
}
function get(obj, keypath) {
    let obj_ = obj;
    for (const key of keypath.split('.'))
        obj_ = obj_[key];
    return obj_;
}
function global_get(keypath) {
    return get(globalThis, keypath);
}
function invoke(obj, funcpath, args) {
    const paths = funcpath.split('.');
    let obj_ = obj;
    for (let i = 0; i < paths.length - 1; i++)
        obj_ = obj_[paths[i]];
    return obj_[paths.at(-1)].call(obj_, ...args);
}
/** 时间间隔 (milliseconds) 格式化 */
function delta2str(delta) {
    if (delta < 1)
        return '0 ms';
    // [1, 100) ms
    if (delta < 100)
        return `${delta.toFixed(0)} ms`;
    // [100, 1000) ms
    // 0.8 s
    if (delta <= 950)
        return `${(delta / 1000).toFixed(1)} s`;
    // 3 s
    if (delta < 1000 * 60)
        return `${(delta / 1000).toFixed()} s`;
    // 1 min 12 s [1 min 0s, 60 min)
    const seconds = Math.trunc(delta / 1000);
    if (seconds < 60 * 60)
        return `${Math.trunc(seconds / 60)} min ${seconds % 60} s`;
    const hour = Math.trunc(seconds / 3600);
    return `${hour} h ${Math.trunc((seconds - 3600 * hour) / 60)} min ${seconds % 60} s`;
}
/** 默认日期时间格式 */
const datetime_format = 'YYYY.MM.DD HH:mm:ss';
/** 默认日期格式 */
const date_format = 'YYYY.MM.DD';
/** 默认时间格式 */
const time_format = 'HH:mm:ss';
class Timer {
    started = Date.now();
    ended = 0;
    /** 停止秒表，保存读数 */
    stop() {
        this.ended = Date.now();
    }
    /** 如果秒表未停止，获取当前秒表读数；
        如果秒表已停止，获取停止时的秒表读数; */
    get() {
        return (this.ended || Date.now()) - this.started;
    }
    /** 获取时间表示字符串，如 1.2 s
        - parenthesis?: `true` 字符串前后加上括号，如 (1.2 s) */
    getstr(parenthesis = false) {
        let s = delta2str(this.get());
        if (parenthesis)
            return s.bracket();
        else
            return s;
    }
    print() {
        console.log(this.getstr(true));
    }
    /** 重置 started */
    reset() {
        this.started = Date.now();
        this.ended = 0;
    }
    get_and_reset() {
        const result = this.get();
        this.reset();
        return result;
    }
    getstr_and_reset(parenthesis) {
        const result = this.getstr(parenthesis);
        this.reset();
        return result;
    }
}
class TimeoutError extends Error {
    name = 'TimeoutError';
}
/** 创建一个 promise，后续可调用 promise.resolve, promise.reject 方法设置其状态和值
    - initial?: `undefined` 传入非 undefined 值（包括 null）时直接设置为 resolved 状态
    注: 下面的方法不能标记为 aysnc function, 否则会对返回值再做一层 Promise.resolve() 导致 reject, resolve 属性丢失 */
function defer(initial) {
    if (initial === undefined) {
        let { promise, resolve, reject } = Promise.withResolvers();
        let p = promise;
        p.resolve = resolve;
        p.reject = reject;
        return p;
    }
    else {
        let p = Promise.resolve(initial);
        p.resolve = _prototype_common_ts__WEBPACK_IMPORTED_MODULE_0__/* .noop */ .lQ;
        p.reject = _prototype_common_ts__WEBPACK_IMPORTED_MODULE_0__/* .noop */ .lQ;
        return p;
    }
}
/** 有 settled 状态的 defer */
function defer2(initial) {
    if (initial === undefined) {
        let settled = false;
        let { promise, resolve, reject } = Promise.withResolvers();
        let p = promise;
        p.resolve = (value) => {
            settled = true;
            resolve(value);
        };
        p.reject = (error) => {
            settled = true;
            reject(error);
        };
        Object.defineProperty(p, 'settled', {
            get() { return settled; },
            enumerable: true,
            configurable: true
        });
        return p;
    }
    else {
        let p = Promise.resolve(initial);
        p.resolve = _prototype_common_ts__WEBPACK_IMPORTED_MODULE_0__/* .noop */ .lQ;
        p.reject = _prototype_common_ts__WEBPACK_IMPORTED_MODULE_0__/* .noop */ .lQ;
        p.settled = true;
        return p;
    }
}
/** @example
    let lock = new Lock(redis)
    
    // 锁定资源后在 action 回调中操作资源，回调 promise 完成后自动释放资源，
    // 三秒内未成功独占资源直接抛出 TimeoutError (开始执行后不受 signal abort 影响)
    await lock.request(async redis => {
        const value = await redis.get('key')
        await redis.set('key', value * 2)
    }, AbortSignal.timeout(3000))
    
    参考:
    https://developer.mozilla.org/en-US/docs/Web/API/Web_Locks_API
    https://github.com/metarhia/web-locks
    https://www.npmjs.com/package/async-lock  */
class Lock {
    /** 如果操作不需要独占资源，可以直接通过 lock.resource 访问，否则需要通过 await lock.request() 独占资源后再访问 */
    resource;
    /** 等待链，新的 await lock.request() 调用会等待当前等待链尾部的 promise 完成，并作为新的尾部 */
    ptail = defer(null);
    /** 查询当前资源是否属于被锁定的状态，方便在资源闲置时做一些可选操作（操作前仍需锁定），或者做一些状态展示 */
    locked = false;
    /** 可以不传 resource，表示管理某个抽象或虚拟的资源 */
    constructor(resource) {
        this.resource = resource;
    }
    /** 通过 await lock.request() 锁定资源以便独占访问，锁定资源后在 action 回调中操作资源，回调 promise 完成 (fullfilled 或 rejected) 后自动释放资源 */
    async request(action, signal) {
        signal?.throwIfAborted();
        const ptail = this.ptail;
        let pcurrent = this.ptail = defer();
        this.locked = true;
        return new Promise((resolve, reject) => {
            // 下面两种情况，先发生的决定 request 返回的 promise 状态
            // 不管是否 aborted, 都要等资源被前一次调用释放，先 aborted 只是将控制权交回给调用者，在锁定资源后不执行 action， 直接释放
            /** 防止执行过程中 signal abort */
            let executing = false;
            signal?.addEventListener('abort', () => {
                if (!executing)
                    // 这里不能释放锁，需要等 ptail resolve 后拿到资源再释放
                    reject(signal.reason);
            }, { once: true });
            ptail.then(async () => {
                // 这里已经能保证独占访问资源
                // 如果 aborted, 可以理解为独占资源失败，调用者不会使用资源，直接释放
                if (signal?.aborted)
                    reject(signal.reason);
                else
                    // 由调用者去操作资源
                    try {
                        executing = true;
                        resolve(await action(this.resource));
                    }
                    catch (error) {
                        reject(error);
                    }
                // 下面开始释放锁
                this.locked = false;
                pcurrent.resolve();
            });
        });
    }
}
/** 过滤符合 pattern 的行 */
function grep(str, pattern) {
    return str.split_lines()
        .filter(typeof pattern === 'string'
        ? line => line.includes(pattern)
        : line => pattern.test(line))
        .join_lines();
}
function lowercase_first_letter(str) {
    return str[0].toLowerCase() + str.slice(1);
}
/** 大于 n 的最小的 2 的幂次 */
function ceil2(n) {
    let power = 1;
    // 不能用 power <<= 1, 结果可能会超过 32 bit 整数导致位运算溢出为 0，死循环
    for (; power <= n; power += power)
        ;
    return power;
}
/** 节流，最多只在时间间隔末尾调用一次，可以设置首次调用是否延后 */
function throttle(duration, func, delay_first = false) {
    let timeout = 0;
    let last = 0;
    let saved_this;
    let saved_args;
    return function throttled(...args) {
        // 当前时间间隔已预定执行，本次调用仅更新调用参数
        if (timeout) {
            saved_this = this;
            saved_args = args;
            return;
        }
        const now = Date.now();
        if (last === 0 && delay_first)
            last = now;
        const ellapsed = now - last;
        // 过了时间间隔末尾，直接执行
        if (ellapsed >= duration) {
            last = now;
            func.apply(this, args);
        }
        else { // 预定在间隔末尾执行
            saved_this = this;
            saved_args = args;
            timeout = setTimeout(() => {
                timeout = null;
                last = Date.now();
                func.apply(saved_this, saved_args);
                saved_this = null;
                saved_args = null;
            }, duration - ellapsed);
        }
    };
}
/** 防抖，间隔一段时间不再触发时调用，同时大幅优化减少 setTimeout, clearTimeout 的调用次数 */
function debounce(duration, func) {
    const half = Math.floor(duration / 2);
    let timeout;
    let last = 0;
    let saved_args;
    let saved_this;
    function debounce_callback() {
        timeout = null;
        func.apply(saved_this, saved_args);
        saved_this = null;
        saved_args = null;
    }
    return function debounced(...args) {
        if (!timeout) {
            timeout = setTimeout(debounce_callback, duration);
            last = Date.now();
            return;
        }
        const now = Date.now();
        saved_args = args;
        saved_this = this;
        if (now - last < half)
            return;
        clearTimeout(timeout);
        setTimeout(debounce_callback, duration);
        last = now;
    };
}
function tomorrow(date) {
    date = typeof date === 'undefined' ? new Date() : new Date(date);
    date.setDate(date.getDate() + 1);
    return date;
}
function to_csv_field(str) {
    return /[,"\n\r]/.test(str) ? str.replaceAll('"', '""').quote('double') : str;
}
/** 设置 error.message 同时更新 error.stack */
function set_error_message(error, message) {
    error.message = message;
    error.stack = `${error.name}: ${message}\n` +
        error.stack.slice_from('\n', { optional: true });
    return error;
}
/** 比较两个数组中的元素完全相同，数组元素用引用比较 */
function array_equals(a, b) {
    if (!a && !b)
        return true;
    if (a && !b || !a && b)
        return false;
    return a.every((x, i) => x === b[i]);
}
function nowstr(with_date = false) {
    const date = new Date();
    return with_date ? date.to_str() : date.to_time_str();
}


/***/ }),

/***/ 4732:
/*!**********************************************************************************!*\
  !*** ./node_modules/.pnpm/emoji-regex@10.6.0/node_modules/emoji-regex/index.mjs ***!
  \**********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (() => {
	// https://mths.be/emoji
	return /[#*0-9]\uFE0F?\u20E3|[\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23ED-\u23EF\u23F1\u23F2\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB\u25FC\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692\u2694-\u2697\u2699\u269B\u269C\u26A0\u26A7\u26AA\u26B0\u26B1\u26BD\u26BE\u26C4\u26C8\u26CF\u26D1\u26E9\u26F0-\u26F5\u26F7\u26F8\u26FA\u2702\u2708\u2709\u270F\u2712\u2714\u2716\u271D\u2721\u2733\u2734\u2744\u2747\u2757\u2763\u27A1\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B55\u3030\u303D\u3297\u3299]\uFE0F?|[\u261D\u270C\u270D](?:\uD83C[\uDFFB-\uDFFF]|\uFE0F)?|[\u270A\u270B](?:\uD83C[\uDFFB-\uDFFF])?|[\u23E9-\u23EC\u23F0\u23F3\u25FD\u2693\u26A1\u26AB\u26C5\u26CE\u26D4\u26EA\u26FD\u2705\u2728\u274C\u274E\u2753-\u2755\u2795-\u2797\u27B0\u27BF\u2B50]|\u26D3\uFE0F?(?:\u200D\uD83D\uDCA5)?|\u26F9(?:\uD83C[\uDFFB-\uDFFF]|\uFE0F)?(?:\u200D[\u2640\u2642]\uFE0F?)?|\u2764\uFE0F?(?:\u200D(?:\uD83D\uDD25|\uD83E\uDE79))?|\uD83C(?:[\uDC04\uDD70\uDD71\uDD7E\uDD7F\uDE02\uDE37\uDF21\uDF24-\uDF2C\uDF36\uDF7D\uDF96\uDF97\uDF99-\uDF9B\uDF9E\uDF9F\uDFCD\uDFCE\uDFD4-\uDFDF\uDFF5\uDFF7]\uFE0F?|[\uDF85\uDFC2\uDFC7](?:\uD83C[\uDFFB-\uDFFF])?|[\uDFC4\uDFCA](?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDFCB\uDFCC](?:\uD83C[\uDFFB-\uDFFF]|\uFE0F)?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDCCF\uDD8E\uDD91-\uDD9A\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF43\uDF45-\uDF4A\uDF4C-\uDF7C\uDF7E-\uDF84\uDF86-\uDF93\uDFA0-\uDFC1\uDFC5\uDFC6\uDFC8\uDFC9\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF8-\uDFFF]|\uDDE6\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF]|\uDDE7\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF]|\uDDE8\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF7\uDDFA-\uDDFF]|\uDDE9\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF]|\uDDEA\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA]|\uDDEB\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7]|\uDDEC\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE]|\uDDED\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA]|\uDDEE\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9]|\uDDEF\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5]|\uDDF0\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF]|\uDDF1\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE]|\uDDF2\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF]|\uDDF3\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF]|\uDDF4\uD83C\uDDF2|\uDDF5\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE]|\uDDF6\uD83C\uDDE6|\uDDF7\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC]|\uDDF8\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF]|\uDDF9\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF]|\uDDFA\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF]|\uDDFB\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA]|\uDDFC\uD83C[\uDDEB\uDDF8]|\uDDFD\uD83C\uDDF0|\uDDFE\uD83C[\uDDEA\uDDF9]|\uDDFF\uD83C[\uDDE6\uDDF2\uDDFC]|\uDF44(?:\u200D\uD83D\uDFEB)?|\uDF4B(?:\u200D\uD83D\uDFE9)?|\uDFC3(?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D(?:[\u2640\u2642]\uFE0F?(?:\u200D\u27A1\uFE0F?)?|\u27A1\uFE0F?))?|\uDFF3\uFE0F?(?:\u200D(?:\u26A7\uFE0F?|\uD83C\uDF08))?|\uDFF4(?:\u200D\u2620\uFE0F?|\uDB40\uDC67\uDB40\uDC62\uDB40(?:\uDC65\uDB40\uDC6E\uDB40\uDC67|\uDC73\uDB40\uDC63\uDB40\uDC74|\uDC77\uDB40\uDC6C\uDB40\uDC73)\uDB40\uDC7F)?)|\uD83D(?:[\uDC3F\uDCFD\uDD49\uDD4A\uDD6F\uDD70\uDD73\uDD76-\uDD79\uDD87\uDD8A-\uDD8D\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA\uDECB\uDECD-\uDECF\uDEE0-\uDEE5\uDEE9\uDEF0\uDEF3]\uFE0F?|[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDC8F\uDC91\uDCAA\uDD7A\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC](?:\uD83C[\uDFFB-\uDFFF])?|[\uDC6E-\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4\uDEB5](?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDD74\uDD90](?:\uD83C[\uDFFB-\uDFFF]|\uFE0F)?|[\uDC00-\uDC07\uDC09-\uDC14\uDC16-\uDC25\uDC27-\uDC3A\uDC3C-\uDC3E\uDC40\uDC44\uDC45\uDC51-\uDC65\uDC6A\uDC79-\uDC7B\uDC7D-\uDC80\uDC84\uDC88-\uDC8E\uDC90\uDC92-\uDCA9\uDCAB-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDDA4\uDDFB-\uDE2D\uDE2F-\uDE34\uDE37-\uDE41\uDE43\uDE44\uDE48-\uDE4A\uDE80-\uDEA2\uDEA4-\uDEB3\uDEB7-\uDEBF\uDEC1-\uDEC5\uDED0-\uDED2\uDED5-\uDED8\uDEDC-\uDEDF\uDEEB\uDEEC\uDEF4-\uDEFC\uDFE0-\uDFEB\uDFF0]|\uDC08(?:\u200D\u2B1B)?|\uDC15(?:\u200D\uD83E\uDDBA)?|\uDC26(?:\u200D(?:\u2B1B|\uD83D\uDD25))?|\uDC3B(?:\u200D\u2744\uFE0F?)?|\uDC41\uFE0F?(?:\u200D\uD83D\uDDE8\uFE0F?)?|\uDC68(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDC68\uDC69]\u200D\uD83D(?:\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?)|[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?)|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]))|\uD83C(?:\uDFFB(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83D\uDC68\uD83C[\uDFFC-\uDFFF])|\uD83E(?:[\uDD1D\uDEEF]\u200D\uD83D\uDC68\uD83C[\uDFFC-\uDFFF]|[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3])))?|\uDFFC(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83D\uDC68\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83E(?:[\uDD1D\uDEEF]\u200D\uD83D\uDC68\uD83C[\uDFFB\uDFFD-\uDFFF]|[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3])))?|\uDFFD(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83D\uDC68\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83E(?:[\uDD1D\uDEEF]\u200D\uD83D\uDC68\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF]|[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3])))?|\uDFFE(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83D\uDC68\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83E(?:[\uDD1D\uDEEF]\u200D\uD83D\uDC68\uD83C[\uDFFB-\uDFFD\uDFFF]|[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3])))?|\uDFFF(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83D\uDC68\uD83C[\uDFFB-\uDFFE])|\uD83E(?:[\uDD1D\uDEEF]\u200D\uD83D\uDC68\uD83C[\uDFFB-\uDFFE]|[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3])))?))?|\uDC69(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?[\uDC68\uDC69]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?|\uDC69\u200D\uD83D(?:\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?))|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]))|\uD83C(?:\uDFFB(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83D\uDC69\uD83C[\uDFFC-\uDFFF])|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFC-\uDFFF]|\uDEEF\u200D\uD83D\uDC69\uD83C[\uDFFC-\uDFFF])))?|\uDFFC(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83D\uDC69\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB\uDFFD-\uDFFF]|\uDEEF\u200D\uD83D\uDC69\uD83C[\uDFFB\uDFFD-\uDFFF])))?|\uDFFD(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83D\uDC69\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF]|\uDEEF\u200D\uD83D\uDC69\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])))?|\uDFFE(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83D\uDC69\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB-\uDFFD\uDFFF]|\uDEEF\u200D\uD83D\uDC69\uD83C[\uDFFB-\uDFFD\uDFFF])))?|\uDFFF(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83D\uDC69\uD83C[\uDFFB-\uDFFE])|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB-\uDFFE]|\uDEEF\u200D\uD83D\uDC69\uD83C[\uDFFB-\uDFFE])))?))?|\uDD75(?:\uD83C[\uDFFB-\uDFFF]|\uFE0F)?(?:\u200D[\u2640\u2642]\uFE0F?)?|\uDE2E(?:\u200D\uD83D\uDCA8)?|\uDE35(?:\u200D\uD83D\uDCAB)?|\uDE36(?:\u200D\uD83C\uDF2B\uFE0F?)?|\uDE42(?:\u200D[\u2194\u2195]\uFE0F?)?|\uDEB6(?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D(?:[\u2640\u2642]\uFE0F?(?:\u200D\u27A1\uFE0F?)?|\u27A1\uFE0F?))?)|\uD83E(?:[\uDD0C\uDD0F\uDD18-\uDD1F\uDD30-\uDD34\uDD36\uDD77\uDDB5\uDDB6\uDDBB\uDDD2\uDDD3\uDDD5\uDEC3-\uDEC5\uDEF0\uDEF2-\uDEF8](?:\uD83C[\uDFFB-\uDFFF])?|[\uDD26\uDD35\uDD37-\uDD39\uDD3C-\uDD3E\uDDB8\uDDB9\uDDCD\uDDCF\uDDD4\uDDD6-\uDDDD](?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDDDE\uDDDF](?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDD0D\uDD0E\uDD10-\uDD17\uDD20-\uDD25\uDD27-\uDD2F\uDD3A\uDD3F-\uDD45\uDD47-\uDD76\uDD78-\uDDB4\uDDB7\uDDBA\uDDBC-\uDDCC\uDDD0\uDDE0-\uDDFF\uDE70-\uDE7C\uDE80-\uDE8A\uDE8E-\uDEC2\uDEC6\uDEC8\uDECD-\uDEDC\uDEDF-\uDEEA\uDEEF]|\uDDCE(?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D(?:[\u2640\u2642]\uFE0F?(?:\u200D\u27A1\uFE0F?)?|\u27A1\uFE0F?))?|\uDDD1(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3\uDE70]|\uDD1D\u200D\uD83E\uDDD1|\uDDD1\u200D\uD83E\uDDD2(?:\u200D\uD83E\uDDD2)?|\uDDD2(?:\u200D\uD83E\uDDD2)?))|\uD83C(?:\uDFFB(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFC-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83E\uDDD1\uD83C[\uDFFC-\uDFFF])|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3\uDE70]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF]|\uDEEF\u200D\uD83E\uDDD1\uD83C[\uDFFC-\uDFFF])))?|\uDFFC(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB\uDFFD-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83E\uDDD1\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3\uDE70]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF]|\uDEEF\u200D\uD83E\uDDD1\uD83C[\uDFFB\uDFFD-\uDFFF])))?|\uDFFD(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83E\uDDD1\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3\uDE70]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF]|\uDEEF\u200D\uD83E\uDDD1\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])))?|\uDFFE(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB-\uDFFD\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3\uDE70]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF]|\uDEEF\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFD\uDFFF])))?|\uDFFF(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB-\uDFFE]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFE])|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3\uDE70]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF]|\uDEEF\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFE])))?))?|\uDEF1(?:\uD83C(?:\uDFFB(?:\u200D\uD83E\uDEF2\uD83C[\uDFFC-\uDFFF])?|\uDFFC(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB\uDFFD-\uDFFF])?|\uDFFD(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])?|\uDFFE(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB-\uDFFD\uDFFF])?|\uDFFF(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB-\uDFFE])?))?)/g;
});


/***/ }),

/***/ 5682:
/*!**************************!*\
  !*** ./lib/io.common.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ZI: () => (/* binding */ message_symbol),
/* harmony export */   qg: () => (/* binding */ parse),
/* harmony export */   qq: () => (/* binding */ pack)
/* harmony export */ });
/* harmony import */ var _prototype_common_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./prototype.common.ts */ 2212);
/* harmony import */ var _utils_common_ts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils.common.ts */ 4701);


// 类型            | 编码
// --------------- | -------------------
// small int +     | 0x00 - 0x1f (0 - 31 自然数)
// small bin       | 0x20 - 0x3f (32 - 63)   0 - 31 个字节的 uint8array
// small string    | 0x40 - 0x7f (64 - 127)  0 - 63 长度的字符串
// small array     | 0x80 - 0x8f (128 - 143) 0 - 15 个元素的数组
// small set       | 0x90 - 0x9f (144 - 159) 0 - 15 个 key 的 set
// small object    | 0xa0 - 0xaf (160 - 175) 0 - 15 个 key 的对象
// small map       | 0xb0 - 0xbf (176 - 191) 0 - 15 个 kv 的 map
// undefined       | 0xc0
// null            | 0xc1
// false           | 0xc2
// true            | 0xc3
// int 8           | 0xc4
// int 16          | 0xc5
// int 32          | 0xc6
// float 64        | 0xc7
// bigint 64       | 0xc8  int64
// bigint string   | 0xc9  string
// error 8         | 0xca  长度 1 b + kv 对
// regexp          | 0xcb  source string + flags string
// rpc message     | 0xcc  small array, 格式为 [id, func, data, error, done], 最后的 undefined 的项去掉
// date            | 0xcd  8 b float64
// url             | 0xce  string
// bin 8           | 0xd0  长度 1 b + 内容
// bin 16          | 0xd1  长度 2 b + 内容
// bin 32          | 0xd2  长度 4 b + 内容
// string 8        | 0xd3  长度 1 b + 内容
// string 16       | 0xd4  长度 2 b + 内容
// string 32       | 0xd5  长度 4 b + 内容
// array 8         | 0xd6
// array 32        | 0xd7
// set 8           | 0xd8
// set 32          | 0xd9
// object kv 对数量只有全部遍历才知道，因此只用 small object / object 16
// object 16       | 0xda  kv 对数 2 b + kv 对
// map 8           | 0xdb
// map 32          | 0xdc
// small int -     | 0xe0 - 0xff  (-32 ~ -1)
// --- 共享状态，可以看成是模块对象的属性 (隐式 this)，有以下好处:
// 避免函数调用时传一堆参数，返回一堆值
// 方便设计 buffer pool, 减少对象创建
// --- 解码
/** 待解码的 buffer */
let buf = new Uint8Array(0);
/** 待解码的 buffer 对应的 dataview */
let dv = buf.dataview;
/** 指针，指向下一个要读取 / 写入的位置 */
let p = 0;
// --- 编码
/** 编码缓冲区，持续往里写入，满了就用一个两倍大小的替换，将旧的未写完的部分复制过来 */
let buffer = new Uint8Array(8 * 2 ** 20 /* Buffer.poolSize */);
/** 编码缓冲区对应的 dataview */
let dataview = buffer.dataview;
/** 指针，编码缓冲区可以写入的位置，只增不减，除非换新 buffer */
let q = 0;
/** 某次编码开始时的位置，用于换缓冲区时从这里开始复制，以及最终返回时的起点 */
let qstart = 0;
const int64max = 1n << 63n;
/** 用这个符号来标识 message 对象 */
const message_symbol = Symbol('message');
const message_keys = ['id', 'func', 'data', 'error', 'done'];
function parse(_buf) {
    // 初始化共享状态
    buf = _buf;
    dv = _buf.dataview;
    p = 0;
    return _parse();
}
function _parse() {
    const type = buf[p++];
    // 0 - 31 自然数
    if (type <= 0x1f)
        return type;
    // small bin
    if (type <= 0x3f)
        return buf.subarray(p, p += type - 0x20);
    // small string (0 - 63 长度的字符串)
    if (type <= 0x7f)
        return parse_string(type - 0x40);
    // small array
    if (type <= 0x8f)
        return parse_array(type - 0x80);
    // small set
    if (type <= 0x9f)
        return parse_set(type - 0x90);
    // small object
    if (type <= 0xaf)
        return parse_object(type - 0xa0);
    // small map
    if (type <= 0xbf)
        return parse_map(type - 0xb0);
    // -32 ~ -1 小负整数
    if (type >= 0xe0)
        return type - 0x100;
    switch (type) {
        case 0xc0:
            return undefined;
        case 0xc1:
            return null;
        case 0xc2:
            return false;
        case 0xc3:
            return true;
        // int 8
        case 0xc4:
            return dv.getInt8(p++);
        // int 16
        case 0xc5:
            return dv.getInt16(inc(2), true);
        // int 32
        case 0xc6:
            return dv.getInt32(inc(4), true);
        // float 64
        case 0xc7:
            return dv.getFloat64(inc(8), true);
        // bigint 64
        case 0xc8:
            return dv.getBigInt64(inc(8), true);
        // bigint string
        case 0xc9:
            return BigInt(_parse());
        // error 8
        case 0xca:
            return Object.assign(new Error(), parse_object(buf[p++]));
        // regexp
        case 0xcb:
            return new RegExp(_parse(), _parse());
        // rpc message
        case 0xcc: {
            const values = _parse();
            let message = {};
            for (let i = 0; i < values.length; ++i)
                message[message_keys[i]] = values[i];
            return message;
        }
        // date
        case 0xcd:
            return new Date(dv.getFloat64(inc(8), true));
        // url
        case 0xce:
            return new URL(_parse());
        // bin 8, 16, 32
        case 0xd0:
        case 0xd1:
        case 0xd2: {
            const len = parse_length(type - 0xd0);
            return buf.subarray(p, p += len);
        }
        // string 8, 16, 32
        case 0xd3:
        case 0xd4:
        case 0xd5:
            return parse_string(parse_length(type - 0xd3));
        // array 8, 32
        case 0xd6:
        case 0xd7:
            return parse_array(parse_length(type === 0xd6 ? 0 : 2));
        // set 8, 32
        case 0xd8:
        case 0xd9:
            return parse_set(parse_length(type === 0xd8 ? 0 : 2));
        // object 16
        case 0xda:
            return parse_object(dv.getUint16(inc(2), true));
        // map 8, 32
        case 0xdb:
        case 0xdc:
            return parse_map(parse_length(type === 0xdb ? 0 : 2));
    }
}
/** 模拟自增 (后置++) 运算符 */
function inc(len) {
    p += len;
    return p - len;
}
function parse_length(length_type) {
    switch (length_type) {
        case 0:
            return buf[p++];
        case 1:
            return dv.getUint16(inc(2), true);
        case 2:
            return dv.getUint32(inc(4), true);
    }
}
function parse_string(len) {
    return (0,_utils_common_ts__WEBPACK_IMPORTED_MODULE_1__/* .decode */ .D4)(buf.subarray(p, p += len));
}
function parse_array(len) {
    let a = new Array(len);
    for (let i = 0; i < len; ++i)
        a[i] = _parse();
    return a;
}
function parse_set(size) {
    let s = new Set();
    for (let i = 0; i < size; ++i)
        s.add(_parse());
    return s;
}
function parse_object(nentries) {
    let o = {};
    for (let i = 0; i < nentries; ++i) {
        const key = _parse();
        o[key] = _parse();
    }
    return o;
}
function parse_map(nentries) {
    let map = new Map();
    for (let i = 0; i < nentries; ++i)
        map.set(_parse(), _parse());
    return map;
}
function pack(obj) {
    qstart = q;
    _pack(obj);
    return buffer.subarray(qstart, q);
}
/** 申请空间，确保 [q, q + size) 可以写入，不够时扩容，换缓冲区，并复制现有内容
    - size: 准备写入多少字节的内容，取值 >= 1 */
function alloc(size) {
    if (q + size <= buffer.byteLength)
        return;
    let buffer_ = new Uint8Array((0,_utils_common_ts__WEBPACK_IMPORTED_MODULE_1__/* .ceil2 */ .ax)(q + size));
    // console.log('扩容:', buffer_.byteLength / 2**20)
    buffer_.set(buffer.subarray(qstart, q));
    buffer = buffer_;
    dataview = buffer_.dataview;
    q -= qstart;
    qstart = 0;
}
function _pack(value) {
    // 提前判断以减少一次函数调用
    if (q + 1 >= buffer.byteLength)
        alloc(1);
    switch (typeof value) {
        case 'undefined':
            buffer[q++] = 0xc0;
            return;
        case 'boolean':
            buffer[q++] = value ? 0xc3 : 0xc2;
            return;
        case 'string': {
            const { length } = value;
            // 分配空间按照极限情况 strlen * 3 考虑，反正先申请着，后面也可以作他用
            // 提前判断以减少一次函数调用
            if (q + 1 + 4 + length * 3 >= buffer.byteLength)
                alloc(1 + 4 + length * 3);
            // 按最乐观的估计，如果估计错误，且影响到布局，再复制
            // 通常受影响的都是小字符串，且概率不大，因此总体复制开销不大
            let lensize = 0;
            if (length <= 0x3f)
                lensize = 0;
            else if (length <= 0xff)
                lensize = 1;
            else if (length <= 0xffff)
                lensize = 2;
            else
                lensize = 4;
            // q (类型), lensize ..., qstr ...
            const qstr = q + 1 + lensize;
            const blen = pack_string(value, qstr);
            if (blen <= 0x3f)
                buffer[q++] = 0x40 + blen;
            else if (blen <= 0xff) {
                if (lensize < 1)
                    buffer.copyWithin(q + 1 + 1, qstr, qstr + blen);
                buffer[q++] = 0xd3;
                buffer[q++] = blen;
            }
            else if (blen <= 0xffff) {
                if (lensize < 2)
                    buffer.copyWithin(q + 1 + 2, qstr, qstr + blen);
                buffer[q++] = 0xd4;
                dataview.setUint16(q, blen, true);
                q += 2;
            }
            else {
                if (lensize < 4)
                    buffer.copyWithin(q + 1 + 4, qstr, qstr + blen);
                buffer[q++] = 0xd5;
                dataview.setUint32(q, blen, true);
                q += 4;
            }
            q += blen;
            return;
        }
        case 'number':
            // 是一个有效的 32 位有符号整数
            if (value >> 0 === value)
                if (value >= 0)
                    if (value <= 0x1f)
                        buffer[q++] = value;
                    else if (value <= 0x7f) {
                        buffer[q++] = 0xc4;
                        alloc(1);
                        buffer[q++] = value;
                    }
                    else if (value <= 0x7fff) {
                        buffer[q++] = 0xc5;
                        alloc(2);
                        dataview.setInt16(q, value, true);
                        q += 2;
                    }
                    else {
                        buffer[q++] = 0xc6;
                        alloc(4);
                        dataview.setInt32(q, value, true);
                        q += 4;
                    }
                else if (value >= -0x20)
                    // 等价于 dataview.setInt8
                    buffer[q++] = value + 0x100;
                else if (value >= -0x80) {
                    buffer[q++] = 0xc4;
                    alloc(1);
                    buffer[q++] = value + 0x100;
                }
                else if (value >= -0x8000) {
                    buffer[q++] = 0xc5;
                    alloc(2);
                    dataview.setInt16(q, value, true);
                    q += 2;
                }
                else {
                    buffer[q++] = 0xc6;
                    alloc(4);
                    dataview.setInt32(q, value, true);
                    q += 4;
                }
            else { // 是浮点数或大于 int32 范围的数
                buffer[q++] = 0xc7;
                alloc(8);
                dataview.setFloat64(q, value, true);
                q += 8;
            }
            return;
        case 'object':
            if (value === null)
                buffer[q++] = 0xc1;
            else if (Array.isArray(value)) {
                const { length } = value;
                if (length <= 0x0f)
                    buffer[q++] = 0x80 + length;
                else if (length <= 0xff) {
                    buffer[q++] = 0xd6;
                    alloc(1);
                    buffer[q++] = length;
                }
                else {
                    buffer[q++] = 0xd7;
                    alloc(4);
                    dataview.setUint32(q, length, true);
                    q += 4;
                }
                for (let i = 0; i < length; ++i)
                    _pack(value[i]);
            }
            else if (value instanceof Uint8Array) {
                const { length } = value;
                if (length <= 0x1f) {
                    buffer[q++] = 0x20 + length;
                    alloc(length);
                }
                else if (length <= 0xff) {
                    buffer[q++] = 0xd0;
                    alloc(1 + length);
                    buffer[q++] = length;
                }
                else if (length <= 0xffff) {
                    buffer[q++] = 0xd1;
                    alloc(2 + length);
                    dataview.setUint16(q, length, true);
                    q += 2;
                }
                else {
                    buffer[q++] = 0xd2;
                    alloc(4 + length);
                    dataview.setUint32(q, length, true);
                    q += 4;
                }
                buffer.set(value, q);
                q += length;
            }
            else if (value instanceof Error) {
                // 乐观认为 error 不超过 255 个 key, 超过的部分直接忽略
                buffer[q++] = 0xca;
                const keys = Object.getOwnPropertyNames(value);
                alloc(1);
                buffer[q++] = keys.length;
                for (const key of keys) {
                    _pack(key);
                    _pack(value[key]);
                }
            }
            else if (value instanceof Date) {
                buffer[q++] = 0xcd;
                alloc(8);
                dataview.setFloat64(q, value.getTime(), true);
                q += 8;
            }
            else if (value instanceof Set) {
                const { size } = value;
                if (size <= 0x0f)
                    buffer[q++] = 0x90 + size;
                else if (size <= 0xff) {
                    buffer[q++] = 0xd8;
                    alloc(1);
                    buffer[q++] = size;
                }
                else {
                    buffer[q++] = 0xd9;
                    alloc(4);
                    dataview.setUint32(q, size, true);
                    q += 4;
                }
                for (const v of value)
                    _pack(v);
            }
            else if (value instanceof Map) {
                const { size } = value;
                if (size <= 0x0f)
                    buffer[q++] = 0xb0 + size;
                else if (size <= 0xff) {
                    buffer[q++] = 0xdb;
                    alloc(1);
                    buffer[q++] = size;
                }
                else {
                    buffer[q++] = 0xdc;
                    alloc(4);
                    dataview.setUint32(q, size, true);
                    q += 4;
                }
                for (const [k, v] of value) {
                    _pack(k);
                    _pack(v);
                }
            }
            else if (value instanceof RegExp) {
                buffer[q++] = 0xcb;
                _pack(value.source);
                _pack(value.flags);
            }
            else if (value instanceof URL) {
                buffer[q++] = 0xce;
                _pack(value.toString());
            }
            else if (message_symbol in value) {
                buffer[q++] = 0xcc;
                let values = (0,_utils_common_ts__WEBPACK_IMPORTED_MODULE_1__/* .seq */ .O6)(message_keys.length, i => value[message_keys[i]]);
                let iend = message_keys.length;
                for (; iend >= 1 && values[iend - 1] === undefined; --iend)
                    _pack(values.slice(0, iend));
            }
            else {
                // 先检查 kv 对的数量是否小于等于 15 (small object)
                // 先不序列化，防止某个 key 对应的 value 很大
                let nkv = 0;
                for (const key in value)
                    if (typeof value[key] !== 'function' && ++nkv === 16)
                        break;
                if (nkv <= 0x0f) // small object
                    buffer[q++] = 0xa0 + nkv;
                else {
                    buffer[q++] = 0xda;
                    // 预留长度，先不填 kv 对数
                    alloc(2);
                    q += 2;
                }
                // 记录相对位置，避免 buffer 替换后位置错误
                const offset = q - qstart - 2;
                nkv = 0;
                for (const key in value) {
                    const v = value[key];
                    if (typeof v === 'function')
                        continue;
                    _pack(key);
                    _pack(v);
                    if (++nkv > 0xffff)
                        throw new Error('对象 key 数量大于 65535，无法序列化');
                }
                if (nkv >= 16)
                    // 补填 kv 对数
                    dataview.setUint16(qstart + offset, nkv, true);
            }
            return;
        case 'bigint':
            if (value < int64max && value >= -int64max) {
                buffer[q++] = 0xc8;
                alloc(8);
                dataview.setBigInt64(q, value, true);
                q += 8;
            }
            else {
                buffer[q++] = 0xc9;
                _pack(value.toString());
            }
            return;
    }
}
/** 从 qstr 位置开始写入编码后的 utf8 内容，使用前需要用 alloc 提前预分配空间，
    返回编码后的字节数 */
function pack_string(value, qstr) {
    const { length } = value;
    if (length <= 0x3f) {
        let j = qstr;
        for (let i = 0; i < length; ++i) {
            let c1 = value.charCodeAt(i), c2 = 0;
            if (c1 < 0x80)
                buffer[j++] = c1;
            else if (c1 < 0x800) {
                buffer[j++] = (c1 >> 6) | 0xc0;
                buffer[j++] = (c1 & 0x3f) | 0x80;
            }
            else if ((c1 & 0xfc00) === 0xd800 && ((c2 = value.charCodeAt(i + 1)) & 0xfc00) === 0xdc00) {
                c1 = 0x10000 + ((c1 & 0x03ff) << 10) + (c2 & 0x03ff);
                ++i;
                buffer[j++] = (c1 >> 18) | 0xf0;
                buffer[j++] = ((c1 >> 12) & 0x3f) | 0x80;
                buffer[j++] = ((c1 >> 6) & 0x3f) | 0x80;
                buffer[j++] = (c1 & 0x3f) | 0x80;
            }
            else {
                buffer[j++] = (c1 >> 12) | 0xe0;
                buffer[j++] = ((c1 >> 6) & 0x3f) | 0x80;
                buffer[j++] = (c1 & 0x3f) | 0x80;
            }
        }
        return j - qstr;
    }
    else
        return (0,_utils_common_ts__WEBPACK_IMPORTED_MODULE_1__/* .encode_into */ .KZ)(value, buffer.subarray(qstr))
            .written;
}


/***/ }),

/***/ 6213:
/*!**********************************!*\
  !*** ./lib/prototype.browser.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

/* harmony import */ var _platform_browser_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./platform.browser.ts */ 3416);
/* harmony import */ var _prototype_common_ts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./prototype.common.ts */ 2212);




/***/ }),

/***/ 7810:
/*!*************************!*\
  !*** ./pages/index.tsx ***!
  \*************************/
/***/ ((module, __unused_webpack___webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony import */ var _lib_net_browser_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @lib/net.browser.ts */ 4688);

const shfcom = 'shenhongfei.com';
const url6 = `https://${shfcom}:9443`;
async function get_public_ports() {
    return (0,_lib_net_browser_ts__WEBPACK_IMPORTED_MODULE_0__/* .request_json */ .bL)('https://ngqltslh.lc-cn-n1-shared.com/1.1/classes/ports/6905d33b1c203d5a4110d509', {
        headers: {
            'x-lc-id': 'NGqlTslhYvngIMDG4a1hTFrz-gzGzoHsz',
            'x-lc-key': 'z3F36uJWrDnJqOpXVC03IrzQ'
        },
        credentials: 'omit'
    });
}
async function select_url() {
    try {
        await (0,_lib_net_browser_ts__WEBPACK_IMPORTED_MODULE_0__/* .request */ .Em)(`${url6}/api/heartbeat`);
        return url6;
    }
    catch { }
    try {
        return `https://4.${shfcom}:${(await get_public_ports())[9443]}${location.pathname}`;
    }
    catch (error) {
        console.error(error);
        return url6;
    }
}
location.href = await select_url();

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } }, 1);

/***/ }),

/***/ 8179:
/*!********************************!*\
  !*** ./lib/platform.common.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   P: () => (/* binding */ set_platform),
/* harmony export */   i: () => (/* binding */ platform)
/* harmony export */ });
let platform;
function set_platform(_platform) {
    platform = _platform;
}


/***/ }),

/***/ 8779:
/*!***************************!*\
  !*** ./lib/net.common.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   pV: () => (/* binding */ drop_request_headers)
/* harmony export */ });
/* unused harmony exports WebSocketConnecting, WebSocketOpen, WebSocketClosing, WebSocketClosed, websocket_states, WebSocketConnectionError, connect_websocket, Remote, Zero */
/* harmony import */ var _platform_common_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./platform.common.ts */ 8179);
/* harmony import */ var _prototype_common_ts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./prototype.common.ts */ 2212);
/* harmony import */ var _io_common_ts__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./io.common.ts */ 5682);
/* harmony import */ var _utils_common_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils.common.ts */ 4701);

 // .bracket()


/** 对于 request() 函数来说无意义的 headers，会自动过滤掉 */
const drop_request_headers = new Set([
    // : 开头的 key
    // sec-*
    'accept-charset',
    'connection',
    'content-length',
    'keep-alive',
    'trailer',
    'transfer-encoding',
    'upgrade',
]);
const WebSocketConnecting = 0;
const WebSocketOpen = 1;
const WebSocketClosing = 2;
const WebSocketClosed = 3;
const websocket_states = ['connecting', 'open', 'closing', 'closed'];
class WebSocketConnectionError extends Error {
    name = 'WebSocketConnectionError';
    // 这里不保留 websocket 引用，防止循环引用导致 JSON 序列化失败
    url;
    protocols;
    type;
    /** close 事件时为 close code (非 1000 的 number), error 事件为 error code (可能是 string) */
    code;
    reason;
    event;
    // --- node.js error event 独有
    address;
    errno;
    port;
    syscall;
    static get_reason_string(code, reason) {
        // https://www.rfc-editor.org/rfc/rfc6455.html#section-7.4.1
        if (!reason)
            if (code === 1001)
                reason = '对端关闭';
            else if (code === 1006)
                reason = '网络中断';
        return reason ? `${reason} (${code})` : code;
    }
    constructor(url, protocols, event, message) {
        let type, reason, code, error;
        if (!message)
            if (event)
                if ((type = event.type) === 'error') {
                    ({ error } = event);
                    message = error ? `连接被关闭: ${error.message}` : '连接被关闭';
                }
                else {
                    ({ code, reason } = event);
                    message = `连接被关闭: ${WebSocketConnectionError.get_reason_string(code, reason)}`;
                }
            else
                message = '连接被关闭';
        super(new Date().to_time_str() + '  ' +
            (url || '传入') +
            (protocols ? ' ' + protocols.join(', ').bracket() : '') +
            ' ' + message);
        this.url = url;
        this.protocols = protocols;
        if (!event)
            return;
        this.type = type;
        this.code = code;
        this.reason = reason;
        if (type === 'error' && _platform_common_ts__WEBPACK_IMPORTED_MODULE_0__/* .platform */ .i.nodejs) {
            this.cause = error;
            this.address = error.address;
            this.errno = error.errno;
            this.port = error.port;
            this.syscall = error.syscall;
        }
        this.event = event;
    }
}
let websocket_proxy_agents = {};
/** 连接 websocket url, 设置各种事件监听器。在 open 事件后 resolve, 返回 websocket
    遇到 error, close 事件时会创建 WebSocketConnectionError:
        - reject 掉返回的 promise (若此时未 settle)
        - 作为参数调用 on_error (已 settle 且有 on_error 回调)
    可以用 WebSocket.bufferedAmount 来查询大消息的发送进度
    https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/bufferedAmount
    - url
    - options:
        - print?: 是否打印连接、关闭信息
        - protocols?
        - max_payload?: `8 gb` (仅 nodejs 环境有效)
        - proxy?: string (仅 nodejs 环境有效)
        - on_message: 根据 websocket frame 的 opcode 不同 (text frame 或 binary frame)，event 中的 data 对应为 ArrayBuffer 或者 string
          https://datatracker.ietf.org/doc/html/rfc6455#section-5.2
        - on_error?: 在 websocket 出错和非正常关闭 (close, error 事件) 时都调用，可以根据 error.type 来区分，error 的类型是 WebSocketConnectionError，
            type 为 'close' 时有 code 和 reason 属性
        - on_close?: 和 websocket 的 'close' 事件不相同，只在正常关闭 (close code 为 1000) 时才调用，否则都会调用 on_error
            https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent#Status_codes */
async function connect_websocket(url, { print = true, protocols, max_payload = 2 ** 33, // 8 GB
proxy, on_message, on_error, on_close, }) {
    const { nodejs } = _platform_common_ts__WEBPACK_IMPORTED_MODULE_0__/* .platform */ .i;
    let websocket = new (await _platform_common_ts__WEBPACK_IMPORTED_MODULE_0__/* .platform */ .i.get_websocket())(url, protocols, 
    // @ts-ignore
    nodejs ?
        {
            maxPayload: max_payload,
            skipUTF8Validation: true,
            allowSynchronousEvents: true,
            ...proxy ? {
                agent: websocket_proxy_agents[proxy] ??= new (await _platform_common_ts__WEBPACK_IMPORTED_MODULE_0__/* .platform */ .i.get_https_proxy_agent())(proxy)
            } : {}
        }
        :
            undefined);
    // https://stackoverflow.com/questions/11821096/what-is-the-difference-between-an-arraybuffer-and-a-blob/39951543
    websocket.binaryType = 'arraybuffer';
    return new Promise((resolve, reject) => {
        let settled = false;
        // websocket error, close 事件只选一个最详细的构造 WebSocketConnectionError 并调用 on_error
        let errored;
        websocket.addEventListener('open', event => {
            if (print)
                console.log(websocket.url +
                    (websocket.protocol ? ' ' + websocket.protocol.bracket() : '') +
                    ' 已连接');
            settled = true;
            resolve(websocket);
        }, { once: true });
        // error 事件会先于 close 事件
        // node.js 环境下 error 事件的错误信息比较多，浏览器环境下 close 的错误信息比较多
        // 在浏览器环境下延后处理 error 事件，放到微任务队列之后的 timers 队列中
        // https://blog.insiderattack.net/promises-next-ticks-and-immediates-nodejs-event-loop-part-3-9226cbe7a6aa
        function on_close_or_error(event) {
            websocket.removeEventListener('message', _on_message);
            const { type } = event;
            // 正常关闭
            if (type === 'close' && event.code === 1000) {
                if (on_close)
                    on_close(event, websocket);
                else if (print)
                    console.log(`${websocket.url} 已正常关闭`);
                return;
            }
            // 观察一段时间，在 nodejs 中应该没有先 close 再 error 的情况
            if (errored === 'close' && _platform_common_ts__WEBPACK_IMPORTED_MODULE_0__/* .platform */ .i.nodejs) {
                console.warn('在 nodejs 中应该没有先 close 再 error 的情况', event.error);
                errored = null;
            }
            // 已经调用过 on_error 了
            if (errored)
                return;
            errored = type;
            const error = new WebSocketConnectionError(websocket.url, protocols, event);
            if (!settled) {
                settled = true;
                reject(error);
                return;
            }
            if (on_error)
                on_error(error, websocket);
            else if (print)
                console.log(error);
        }
        // 检查实际情况下 error 事件会先于 close 事件，观察一段时间后可删去
        let closed = false;
        websocket.addEventListener('error', (event) => {
            if (closed)
                console.warn('close 事件先于 error 事件发生，奇怪！');
            if (nodejs)
                on_close_or_error(event);
            else
                setTimeout(() => { on_close_or_error(event); });
        }, { once: true });
        websocket.addEventListener('close', event => {
            closed = true;
            on_close_or_error(event);
        }, { once: true });
        function _on_message(event) {
            on_message(event.data, websocket);
        }
        websocket.addEventListener('message', _on_message);
    });
}
/** 通过创建 remote 对象对 websocket rpc 进行抽象
    使用 remote.call() 进行一元 rpc
    使用 remote.send() 结合 message.id 进行复杂 rpc
    
    可传入 funcs 注册函数，使得对端能调用，传入后，
    连接发起方在检测到连接断开后间隔 2s (首次) / 10s 尝试重连
    
    可启用 probe 选项启用主动探测连接，进一步确保连接可靠性
    
    有两种创建方法:
    - 传入 url 主动创建 websocket 连接
        创建后等到首个 remote.call 或 remote.send 时建立实际 websocket 连接
    - 传入 websocket，监听事件，将已有的 websocket 连接转为 rpc 通道
    
    rpc 状态与底层连接的状态无关，如果是发起方，remote.send 时检测到断线会自动尝试建立新的 websocket 连接 */
class Remote {
    /** 对端名称，方便接收端提供更明确的报错信息 */
    name;
    /** 作为 websocket 连接发起方，对端的 url 地址 */
    url;
    /** 能被对端调用的函数 */
    funcs;
    /** `false` 是否启用主动探测连接，在连接状态下以 30s 间隔发送心跳包确保连接状态 */
    probe = false;
    /** websocket 连接建立成功时调用对端 register 函数的参数 (仅发起方有效) */
    args;
    /** `true` 是否打印连接信息、错误信息 */
    print = true;
    /** `false` 打印所有交互的 rpc messages */
    verbose = false;
    // --- states
    /** 防止作为 websocket 连接发起方时并发创建 websocket 连接 */
    lwebsocket = new _utils_common_ts__WEBPACK_IMPORTED_MODULE_3__/* .Lock */ .c_();
    /** map<id, message handler>: 通过 (rpc message).id 找到对应的 handler
        一元 rpc 接收方不需要设置 handlers, 发送方需要 */
    handlers = new Map();
    /** 是否正在定时主动检测重连 */
    probing = false;
    /** websocket 检测到错误，_on_error 被调用，此时会尝试一段时间后重连 */
    reconnecting;
    /** 用户是否手动调用了 disconnect() 主动断开了连接 (仅发起方有效) */
    disconnected = false;
    /** on_error 接收到的，正常 websocket 连接发生的首个非 TimeoutError 错误 */
    error;
    /** 作为 websocket 连接发起方，传入 url
        作为 websocket 连接接收方，传入 websocket + name */
    constructor({ name, url, websocket, funcs, print, verbose, probe, args, on_error, on_reconnect } = {}) {
        if (name)
            this.name = name;
        if (url) {
            (0,_utils_common_ts__WEBPACK_IMPORTED_MODULE_3__/* .check */ .z6)(!websocket, '构建 Remote 时 url 和 websocket 只能传其中一个');
            this.url = url;
            if (on_reconnect)
                this.on_reconnect = on_reconnect;
        }
        else { // 连接接收方，一定是 nodejs 环境
            (0,_utils_common_ts__WEBPACK_IMPORTED_MODULE_3__/* .check */ .z6)(websocket, '构建 Remote 时需传入 url 或者 websocket');
            this.lwebsocket.resource = websocket;
            websocket.binaryType = 'arraybuffer';
            // 参考 connect_websocket 实现
            let errored = false;
            const on_close_or_error = (event) => {
                websocket.removeEventListener('message', _on_message);
                // 正常关闭
                if (event.type === 'close' && event.code === 1000) {
                    if (print)
                        console.log(`${this.name || websocket.url || '传入连接'} 已正常关闭`);
                    return;
                }
                // 已经调用过 on_error 了
                if (errored)
                    return;
                errored = true;
                this._on_error(new WebSocketConnectionError(this.name || websocket.url, websocket.protocol ? [websocket.protocol] : undefined, event));
            };
            // 检查实际情况下 error 事件会先于 close 事件，观察一段时间后可删去
            let closed = false;
            websocket.addEventListener('error', (event) => {
                if (closed)
                    console.warn('close 事件先于 error 事件发生，奇怪！');
                on_close_or_error(event);
            }, { once: true });
            websocket.addEventListener('close', event => {
                closed = true;
                on_close_or_error(event);
            }, { once: true });
            const _on_message = (event) => {
                this._on_message(event.data);
            };
            websocket.addEventListener('message', _on_message);
        }
        if (funcs) {
            (0,_utils_common_ts__WEBPACK_IMPORTED_MODULE_3__/* .check */ .z6)(!funcs.echo);
            this.funcs = funcs;
        }
        if (probe !== undefined)
            this.probe = probe;
        if (args)
            this.args = args;
        if (print !== undefined)
            this.print = print;
        if (verbose !== undefined)
            this.verbose = verbose;
        if (on_error)
            this.on_error = on_error;
    }
    /** 统一处理首次连接和连接后的 websocket 错误 */
    _on_error = (error) => {
        if (this.disconnected)
            return;
        // 去重
        if (error === this.error)
            return;
        // 重连
        if (error instanceof WebSocketConnectionError &&
            !this.reconnecting &&
            this.url &&
            (this.funcs || this.probe)) {
            this.reconnecting = setTimeout(this.reconnect, this.error ? 20_000 : 2_000);
            this.error = error;
        }
        this.on_error(error, this);
    };
    on_reconnect;
    reconnect = async () => {
        this.reconnecting = null;
        if (this.on_reconnect)
            await this.on_reconnect();
        this.try_connect();
    };
    _on_message = (data) => {
        this.handle(new Uint8Array(data));
    };
    /** 使用者自定义的在 websocket 连接出错时，或者 handlers 出错时的处理
        用户设置后会覆盖默认的 print 错误功能 */
    on_error(error, remote) {
        // 使用者未定义 Remote 如何处理 error 时，一般来说简单打印即可，因为 handlers 中报错了也会返回给对端
        if (this.print)
            this.print_error(error);
        // 这里继续往上层抛没有太大意义，上面一般都是 websocket on_message 这些
    }
    print_error(error) {
        console.warn(error instanceof WebSocketConnectionError ?
            error.message
            :
                error);
    }
    /** 检查是否已经有 error, websocket 状态是否正常 (open | connecting)
        返回 true: 连接正常，false: 连接异常 */
    check_connection() {
        if (this.error)
            return false;
        const { readyState } = this.lwebsocket.resource || {};
        return readyState === WebSocketOpen || readyState === WebSocketConnecting;
    }
    /** 幂等，保证 websocket 已连接，否则抛出异常
        通常用于手动建立 websocket 连接并确保成功
        连接断开后，作为发起方会自动创建新的 websocket 连接;
        作为接收方只会检查连接状态，在断开时抛出异常
        保存的 rpc 状态在 this.handlers, 与 websocket 无关，因此即使断开重连也不影响 rpc 的运行，即
        底层连接断开后自动重连对上层应该是无感知的，除非再次连接时失败 */
    async connect() {
        if (this.disconnected)
            throw new Error(`remote (${this.name || this.url}) 已调用过 disconnect 断开连接，无法再次 connect`);
        // 首次 connect 开始探测
        if (this.probe && !this.probing)
            this.probe_connection();
        if (this.check_connection())
            return;
        try {
            if (!this.url) {
                if (this.error)
                    throw this.error;
                const { resource: websocket } = this.lwebsocket;
                throw new WebSocketConnectionError(this.name || websocket.url, websocket.protocol ? [websocket.protocol] : undefined, undefined, `连接状态异常: ${websocket_states[this.lwebsocket.resource.readyState]}`);
            }
            // 假设有多个请求想要并发连接 websocket, 且此时 websocket 是断开的状态
            // 应该排队依次连接，而不是后续的连接直接使用第一次连接的 promise，后续调用还是应该尝试重连（不止连接一次）
            await this.lwebsocket.request(this._connect);
        }
        catch (error) {
            this._on_error(error);
            throw error;
        }
    }
    _connect = async () => {
        if (this.check_connection())
            return;
        // 重连
        this.lwebsocket.resource = await connect_websocket(this.url, {
            on_message: this._on_message,
            on_error: this._on_error,
            print: this.print
        });
        this.error = null;
        if (this.args)
            await this.call('register', this.args);
    };
    /** 尝试建立连接，通常用于开始保活
        重连错误会在 this.connect 里面调用 this._on_error 处理 */
    async try_connect() {
        try {
            await this.connect();
        }
        catch { }
    }
    /** 开始心跳保活 */
    async probe_connection(print_timeout = true) {
        // 手动调用该函数时也会启用 probe
        this.probe = true;
        this.probing = true;
        for (let timeouted = false;;) {
            await (0,_utils_common_ts__WEBPACK_IMPORTED_MODULE_3__/* .delay */ .cb)(timeouted ? 5_000 : 30_000);
            if (this.disconnected || !this.url && !this.check_connection() || !this.probe)
                break;
            if (this.reconnecting)
                continue;
            // 产生的非 TimeoutError 应该都通过 _on_error 输出了，同时可能触发了重连
            timeouted = (await this.test(print_timeout)) instanceof _utils_common_ts__WEBPACK_IMPORTED_MODULE_3__/* .TimeoutError */ .MU;
        }
    }
    /** 检测连接，返回连接错误，出错时触发 on_error 打印错误信息
        返回值:
        - 连接正常返回: undefined
        - 连接错误返回: 实际的连接错误，通常是 WebSocketConnectionError | TimeoutError */
    async test(print_timeout = true) {
        try {
            await (0,_utils_common_ts__WEBPACK_IMPORTED_MODULE_3__/* .timeout */ .wR)(5_000, this.call('echo'), undefined, false);
        }
        catch (error) {
            if (error instanceof _utils_common_ts__WEBPACK_IMPORTED_MODULE_3__/* .TimeoutError */ .MU) {
                let message;
                if (_platform_common_ts__WEBPACK_IMPORTED_MODULE_0__/* .platform */ .i.get_net_speed_string)
                    message = `连接正忙或无响应 ${_platform_common_ts__WEBPACK_IMPORTED_MODULE_0__/* .platform */ .i.get_net_speed_string()}`;
                else {
                    const websocket = this.lwebsocket.resource;
                    if (websocket?.bufferedAmount)
                        message = `连接正忙，待发 ${websocket.bufferedAmount.to_fsize_str()}`;
                    else
                        message = '连接正在收数据或无响应';
                }
                (0,_utils_common_ts__WEBPACK_IMPORTED_MODULE_3__/* .set_error_message */ .gk)(error, message = `${new Date().to_time_str()}  ${this.name || this.url} ${message}`);
                if (this.print && print_timeout)
                    console.warn(message);
            }
            return error;
        }
    }
    /** 手动关闭到对端的 websocket 连接 */
    disconnect() {
        this.disconnected = true;
        this.lwebsocket.resource?.close(1000);
    }
    /** 发送 message 到对端 remote
        发送或连接出错时自动清理 message.id 对应的 handler */
    async send(message) {
        if (this.verbose)
            console.log('remote.send:', message);
        try {
            await this.connect();
            message[_io_common_ts__WEBPACK_IMPORTED_MODULE_2__/* .message_symbol */ .ZI] = true;
            // 不需要独占 websocket
            this.lwebsocket.resource.send((0,_io_common_ts__WEBPACK_IMPORTED_MODULE_2__/* .pack */ .qq)(message));
        }
        catch (error) {
            if (message.id)
                this.handlers.delete(message.id);
            throw error;
        }
    }
    /** 能发就发一下，忽略发送失败, best effort */
    try_send(message) {
        message[_io_common_ts__WEBPACK_IMPORTED_MODULE_2__/* .message_symbol */ .ZI] = true;
        // websocket.send 本身通常不会 throw error
        this.lwebsocket.resource?.send((0,_io_common_ts__WEBPACK_IMPORTED_MODULE_2__/* .pack */ .qq)(message));
    }
    /** 处理接收到的 websocket message 并解析, 根据 message.id 或 message.func 分发到对应的 handler 进行处理，
        handler 处理完成后:
        - 传了 func: 调用函数的情况下 (通常是一元 rpc)，总是将返回值包装为 message 回传
        - 未传 func: 通过 id 调用，如果 handler 返回非 undefined 的值，也包装为 message 回传
        
        如果 message.done == true 则对端指示当前 remote 可以清理 handler
        使用 Uint8Array 作为参数更灵活 https://stackoverflow.com/a/74505197/7609214
        这个方法一般不会抛出错误，也不需要 await，一般在 websocket on_message 时使用 */
    async handle(data) {
        let message;
        try {
            (0,_utils_common_ts__WEBPACK_IMPORTED_MODULE_3__/* .check */ .z6)(data[0] === 0xcc, 'message 格式错误');
            message = (0,_io_common_ts__WEBPACK_IMPORTED_MODULE_2__/* .parse */ .qg)(data);
        }
        catch (error) {
            this.on_error(error, this);
            return;
        }
        const { id, func, done } = message;
        if (this.verbose)
            console.log('remote.handle:', message);
        try {
            if (func === 'echo') {
                await this.send({ id, data: message.data });
                return;
            }
            let handler;
            if (func) {
                handler = this.funcs[func];
                // 传了 func 调用函数的情况下，如果 message.data 为 undefined, 默认为 [ ]
                if (message.data === undefined)
                    message.data = [];
            }
            else {
                handler = this.handlers.get(id);
                if (done && handler)
                    this.handlers.delete(id);
            }
            if (handler) {
                const data = await handler(message, this);
                if (func || data !== undefined)
                    await this.send({ id, data });
            }
            else if (message.error)
                throw message.error;
            else if (func)
                throw new Error(`找不到 func: ${func.quote()}`);
            else
                console.log(`忽略找不到的 handler id: ${id}`);
        }
        catch (error) {
            // handler 出错并不意味着 rpc 一定会结束，可能 error 是运行中的正常数据，所以不能清理 handler
            // 这里继续往上层抛没有太大意义，上面一般都是 websocket on_message 这些，交给自定义或默认的 on_error 处理
            this._on_error(error);
            if (this.check_connection() &&
                !message.error // 防止无限循环往对方发送 error, 只有在对方无错误时才可以发送
            )
                try {
                    await this.send({ id, error /* 不能设置 done 清理对面 handler, 理由同上 */ });
                }
                catch { }
        }
    }
    /** 调用对端 remote 中的 func, 只适用于最简单的一元 rpc (请求, 响应) */
    async call(func, args) {
        let promise = (0,_utils_common_ts__WEBPACK_IMPORTED_MODULE_3__/* .defer */ .v6)();
        const id = (0,_utils_common_ts__WEBPACK_IMPORTED_MODULE_3__/* .genid */ .GW)();
        this.handlers.set(id, ({ error, data }) => {
            if (error)
                promise.reject(error);
            else
                promise.resolve(data);
            this.handlers.delete(id);
        });
        await this.send({ id, func, data: args }); // 不需要 done: true, 因为对面的 remote.handlers 中不会有这个 id 的 handler
        return promise;
    }
    /** 调用对端 remote 中的 func, 开始订阅并接收连续的消息 (订阅流)
        - func: 订阅处理函数
        - on_data: 接收开始订阅后的数据
        - options?:
            - on_error?: 处理开始订阅后的错误 */
    async subscribe(func, on_data, on_error = _prototype_common_ts__WEBPACK_IMPORTED_MODULE_1__/* .rethrow */ .AL) {
        const id = (0,_utils_common_ts__WEBPACK_IMPORTED_MODULE_3__/* .genid */ .GW)();
        let psubscribed = new Promise((resolve, reject) => {
            let first = true;
            this.handlers.set(id, ({ error, data }) => {
                if (error) {
                    if (first) {
                        first = false;
                        this.handlers.delete(id);
                        reject(error);
                    }
                    else
                        on_error(error, this);
                    return;
                }
                if (first) {
                    first = false;
                    resolve({ id, data: data });
                    return;
                }
                on_data(data);
            });
        });
        try {
            await this.send({ id, func });
        }
        catch (error) {
            this.handlers.delete(id);
            throw error;
        }
        return psubscribed;
    }
}
class Zero extends Remote {
    static guess_url({ url, websocket }) {
        if (url)
            return url;
        if (websocket)
            return;
        if (!globalThis.location)
            return 'ws://localhost';
        const { protocol, host } = location;
        if (protocol === 'chrome-extension:' || protocol === 'vscode-webview:')
            return 'ws://localhost';
        return `ws${protocol === 'https:' ? 's' : ''}://${host}`;
    }
    constructor(options = {}) {
        super({
            url: Zero.guess_url(options),
            ...options
        });
    }
    /** 执行 func 并传参，获取 func 返回值 */
    async invoke(func, args = []) {
        return this.call('rpc', [func, /* empty rpc options */ undefined, ...args]);
    }
    /** 执行 func 并传参，等待完成，func 返回值在对端直接丢弃 */
    async execute(func, args = []) {
        await this.call('rpc', [func, rpc_ignore, ...args]);
    }
    /** 执行 func 并传参，不等待完成，在对端确认收到后成功返回 */
    async invoke_async(func, args = []) {
        await this.call('rpc', [func, rpc_async, ...args]);
    }
}
const rpc_ignore = { ignore: true };
const rpc_async = { async: true };


/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/async module */
/******/ (() => {
/******/ 	var hasSymbol = typeof Symbol === "function";
/******/ 	var webpackQueues = hasSymbol ? Symbol("webpack queues") : "__webpack_queues__";
/******/ 	var webpackExports = hasSymbol ? Symbol("webpack exports") : "__webpack_exports__";
/******/ 	var webpackError = hasSymbol ? Symbol("webpack error") : "__webpack_error__";
/******/ 	
/******/ 	
/******/ 	var resolveQueue = (queue) => {
/******/ 		if(queue && queue.d < 1) {
/******/ 			queue.d = 1;
/******/ 			queue.forEach((fn) => (fn.r--));
/******/ 			queue.forEach((fn) => (fn.r-- ? fn.r++ : fn()));
/******/ 		}
/******/ 	}
/******/ 	var wrapDeps = (deps) => (deps.map((dep) => {
/******/ 		if(dep !== null && typeof dep === "object") {
/******/ 	
/******/ 			if(dep[webpackQueues]) return dep;
/******/ 			if(dep.then) {
/******/ 				var queue = [];
/******/ 				queue.d = 0;
/******/ 				dep.then((r) => {
/******/ 					obj[webpackExports] = r;
/******/ 					resolveQueue(queue);
/******/ 				}, (e) => {
/******/ 					obj[webpackError] = e;
/******/ 					resolveQueue(queue);
/******/ 				});
/******/ 				var obj = {};
/******/ 	
/******/ 				obj[webpackQueues] = (fn) => (fn(queue));
/******/ 				return obj;
/******/ 			}
/******/ 		}
/******/ 		var ret = {};
/******/ 		ret[webpackQueues] = x => {};
/******/ 		ret[webpackExports] = dep;
/******/ 		return ret;
/******/ 	}));
/******/ 	__webpack_require__.a = (module, body, hasAwait) => {
/******/ 		var queue;
/******/ 		hasAwait && ((queue = []).d = -1);
/******/ 		var depQueues = new Set();
/******/ 		var exports = module.exports;
/******/ 		var currentDeps;
/******/ 		var outerResolve;
/******/ 		var reject;
/******/ 		var promise = new Promise((resolve, rej) => {
/******/ 			reject = rej;
/******/ 			outerResolve = resolve;
/******/ 		});
/******/ 		promise[webpackExports] = exports;
/******/ 		promise[webpackQueues] = (fn) => (queue && fn(queue), depQueues.forEach(fn), promise["catch"](x => {}));
/******/ 		module.exports = promise;
/******/ 		var handle = (deps) => {
/******/ 			currentDeps = wrapDeps(deps);
/******/ 			var fn;
/******/ 			var getResult = () => (currentDeps.map((d) => {
/******/ 	
/******/ 				if(d[webpackError]) throw d[webpackError];
/******/ 				return d[webpackExports];
/******/ 			}))
/******/ 			var promise = new Promise((resolve) => {
/******/ 				fn = () => (resolve(getResult));
/******/ 				fn.r = 0;
/******/ 				var fnQueue = (q) => (q !== queue && !depQueues.has(q) && (depQueues.add(q), q && !q.d && (fn.r++, q.push(fn))));
/******/ 				currentDeps.map((dep) => (dep[webpackQueues](fnQueue)));
/******/ 			});
/******/ 			return fn.r ? promise : getResult();
/******/ 		}
/******/ 		var done = (err) => ((err ? reject(promise[webpackError] = err) : outerResolve(exports)), resolveQueue(queue))
/******/ 		body(handle, done);
/******/ 		queue && queue.d < 0 && (queue.d = 0);
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/************************************************************************/
/******/ 
/******/ // startup
/******/ // Load entry module and return exports
/******/ // This entry module used 'module' so it can't be inlined
/******/ var __webpack_exports__ = __webpack_require__(7810);
/******/ __webpack_exports__ = await __webpack_exports__;
/******/ 

//# sourceMappingURL=index.js.map