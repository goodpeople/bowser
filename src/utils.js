class Utils {
  /**
   * Get first matched item for a string
   * @param {RegExp} regexp
   * @param {String} ua
   * @return {Array|{index: number, input: string}|*|boolean|string}
   */
  static getFirstMatch(regexp, ua) {
    const match = ua.match(regexp);
    return (match && match.length > 0 && match[1]) || '';
  }

  /**
   * Get second matched item for a string
   * @param regexp
   * @param {String} ua
   * @return {Array|{index: number, input: string}|*|boolean|string}
   */
  static getSecondMatch(regexp, ua) {
    const match = ua.match(regexp);
    return (match && match.length > 1 && match[2]) || '';
  }

  /**
   * Match a regexp and return a constant or undefined
   * @param {RegExp} regexp
   * @param {String} ua
   * @param {*} _const Any const that will be returned if regexp matches the string
   * @return {*}
   */
  static matchAndReturnConst(regexp, ua, _const) {
    if (regexp.test(ua)) {
      return _const;
    }
    return void (0);
  }

  static getWindowsVersionName(version) {
    switch (version) {
      case 'NT': return 'NT';
      case 'XP': return 'XP';
      case 'NT 5.0': return '2000';
      case 'NT 5.1': return 'XP';
      case 'NT 5.2': return '2003';
      case 'NT 6.0': return 'Vista';
      case 'NT 6.1': return '7';
      case 'NT 6.2': return '8';
      case 'NT 6.3': return '8.1';
      case 'NT 10.0': return '10';
      default: return undefined;
    }
  }

  /**
   * Get version precisions count
   *
   * @example
   *   getVersionPrecision("1.10.3") // 3
   *
   * @param  {string} version
   * @return {number}
   */
  static getVersionPrecision(version) {
    return version.split('.').length;
  }

  /**
   * Calculate browser version weight
   *
   * @example
   *   compareVersions(['1.10.2.1',  '1.8.2.1.90'])    // 1
   *   compareVersions(['1.010.2.1', '1.09.2.1.90']);  // 1
   *   compareVersions(['1.10.2.1',  '1.10.2.1']);     // 0
   *   compareVersions(['1.10.2.1',  '1.0800.2']);     // -1
   *
   * @param {String} versionA versions versions to compare
   * @param {String} versionB versions versions to compare
   * @return {Number} comparison result: -1 when versionA is lower,
   * 1 when versionA is bigger, 0 when both equal
   */
  /* eslint consistent-return: 1 */
  static compareVersions(versionA, versionB) {
    // 1) get common precision for both versions, for example for "10.0" and "9" it should be 2
    let precision = Math.max(
      Utils.getVersionPrecision(versionA),
      Utils.getVersionPrecision(versionB),
    );

    const chunks = Utils.map([versionA, versionB], (version) => {
      const delta = precision - Utils.getVersionPrecision(version);

      // 2) "9" -> "9.0" (for precision = 2)
      const _version = version + new Array(delta + 1).join('.0');

      // 3) "9.0" -> ["000000000"", "000000009"]
      return Utils.map(_version.split('.'), chunk => new Array(20 - chunk.length).join('0') + chunk).reverse();
    });

    // iterate in reverse order by reversed chunks array
    precision -= 1;
    while (precision >= 0) {
      // 4) compare: "000000009" > "000000010" = false (but "9" > "10" = true)
      if (chunks[0][precision] > chunks[1][precision]) {
        return 1;
      } else if (chunks[0][precision] === chunks[1][precision]) {
        if (precision === 0) {
          // all version chunks are same
          return 0;
        }
      } else {
        return -1;
      }
      precision -= 1;
    }
  }

  /**
   * Array::map polyfill
   *
   * @param  {Array} arr
   * @param  {Function} iterator
   * @return {Array}
   */
  static map(arr, iterator) {
    const result = [];
    let i;
    if (Array.prototype.map) {
      return Array.prototype.map.call(arr, iterator);
    }
    for (i = 0; i < arr.length; i += 1) {
      result.push(iterator(arr[i]));
    }
    return result;
  }
}

module.exports = Utils;
