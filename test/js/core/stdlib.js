describe('internal foam.LIB', function() {

  beforeEach(function() {
  });
  afterEach(function() {
  });

  it('applies constants', function() {
    foam.LIB({
        name: 'foam.testLib',
        constants: {
          CONST: 'val'
        }
    });
    expect(foam.testLib.CONST).toEqual('val');
  });

});

describe('Object.$UID', function() {

  beforeEach(function() {
  });
  afterEach(function() {
  });

  it('is unique', function() {
      var o1 = {};
      var o2 = {};
      expect(o1.$UID).not.toEqual(o2.$UID);

      var o3 = {};
      expect(o1.$UID).not.toEqual(o3.$UID);
      expect(o2.$UID).not.toEqual(o3.$UID);
  });

});

describe('fn.memoize1', function() {

  beforeEach(function() {
  });
  afterEach(function() {
  });

  it('accepts a null argument', function() {
    var f = foam.fn.memoize1(function(arg) { return arg; });
    var r = f(null);
    expect(f(null)).toBe(r);
  });

});


describe('string.pad', function() {

  beforeEach(function() {
  });
  afterEach(function() {
  });

  it('pads left', function() {
    expect(foam.string.pad("wee", -6)).toEqual("   wee");
  });

});

describe('Number.compareTo', function() {

  beforeEach(function() {
  });
  afterEach(function() {
  });

  it('compares', function() {
    var n = new Number(3);
    expect(foam.compare.compare(n, 3)).toEqual(0);
    expect(foam.compare.compare(n, 1)).toEqual(1);
    expect(foam.compare.compare(n, 6)).toEqual(-1);
  });

});
describe('String.compareTo', function() {

  beforeEach(function() {
  });
  afterEach(function() {
  });

  it('compares', function() {
    var n = new String("bbb");
    expect(foam.compare.compare(n, "bbb")).toEqual(0);
    expect(foam.compare.compare(n, "aa")).toEqual(1);
    expect(foam.compare.compare(n, "ccc")).toEqual(-1);
  });

});


describe('Array diff', function() {
  var x;
  var y;

  beforeEach(function() {
    foam.CLASS({
      name: 'CompA',
      package: 'test',
      properties: [ 'a', 'b' ]
    });
    foam.CLASS({
      name: 'CompB',
      package: 'test',
      properties: [ 'b', 'c' ]
    });
    x = test.CompA.create();
    y = test.CompB.create();
  });
  afterEach(function() {
    x = y = null;
  });

  it('reports no change correctly', function() {
    var a = ['a', 't', x];
    expect(a.diff(a).added).toEqual([]);
    expect(a.diff(a).removed).toEqual([]);

    var b = [];
    expect(b.diff(b).added).toEqual([]);
    expect(b.diff(b).removed).toEqual([]);
  });
  it('finds added primitive elements', function() {
    var a = ['a', 't'];
    var b = ['a', 'r', 't'];
    expect(a.diff(b).added).toEqual(['r']);
  });
  it('finds removed primitive elements', function() {
    var a = ['a', 't'];
    var b = ['a', 'r', 't'];
    expect(b.diff(a).removed).toEqual(['r']);
  });
  it('finds added object elements', function() {
    var a = [x, 4];
    var b = [y, x, 4];
    expect(a.diff(b).added).toEqual([y]);
  });
  it('finds removed object elements', function() {
    var a = [y, 4];
    var b = [y, x, 4];
    expect(b.diff(a).removed).toEqual([x]);
  });
  it('finds swapped elements', function() {
    var a = [y, 4, 8];
    var b = [4, x, 'hello'];
    expect(a.diff(b).added).toEqual([x, 'hello']);
    expect(a.diff(b).removed).toEqual([y, 8]);
  });
  it('treats multiple copies of an element as separate items', function() {
    var a = [4,5,6,7,8,8];
    var b = [4,4,4,4,8,8];
    expect(a.diff(b).added).toEqual([4,4,4]);
    expect(a.diff(b).removed).toEqual([5,6,7]);
  });
});

describe('Array clone (deep copy)', function() {
  it('creates a new array', function() {
    var a = [2,4,6,8];
    var b = a.clone();
    expect(a).not.toBe(b);
    expect(a).toEqual(b);
  });
  it('clones instances', function() {
    var a = [2, foam.core.Property.create({ name: 'hello' }), 4];
    var b = a.clone();
    expect(a).not.toBe(b);
    expect(a).toEqual(b);
    expect(a[1]).not.toBe(b[1]);
  });
});

describe('foam.fn.argsArray', function() {

  it('handles an empty arg list', function() {
    var fn = function( ) {
      return (true);
    }
    var args = foam.fn.argsArray(fn);
    expect(args).toEqual([]);
  });

  it('grabs simple argument names', function() {
    var fn = function(str, bool ,
       func, obj, num,  arr ) {
      return (true);
    }
    var args = foam.fn.argsArray(fn);
    expect(args).toEqual([ 'str', 'bool', 'func', 'obj', 'num', 'arr' ]);
  });

  it('grabs typed argument names', function() {
    var fn = function(/* string */ str, /*boolean*/ bool ,
      /* function*/ func, /*object*/obj, /* number */num, /* array*/ arr ) {
      return (true);
    }
    var args = foam.fn.argsArray(fn);
    expect(args).toEqual([ 'str', 'bool', 'func', 'obj', 'num', 'arr' ]);
  });

  it('grabs commented argument names', function() {
    var fn = function(/* any // the argument value to validate. */ arg, more,
        /* // a comment here */ name, another /* return // comment */) {
      return (true);
    }
    var args = foam.fn.argsArray(fn);
    expect(args).toEqual([ 'arg', 'more', 'name', 'another' ]);
  });

});


describe('Date', function() {
  beforeEach(function() {
    jasmine.clock().install();
  });
  afterEach(function() {
    jasmine.clock().uninstall();
  });

  it('correctly reports equals', function() {
    expect(foam.compare.equals(new Date(7487474), new Date(7487474))).toBe(true);
    expect(foam.compare.equals(new Date(7487474), new Date(23423432))).toBe(false);

    expect(foam.compare.equals((new Date(7487474), null))).toBe(false);
    expect(foam.compare.equals(new Date(7487474), 7487474)).toBe(true);
  });
  it('correctly reports compareTo', function() {
    expect(foam.compare.compare(new Date(7487474), new Date(7487474))).toEqual(0);
    expect(foam.compare.compare(new Date(234324), new Date(23423432))).toEqual(-1);

    expect(foam.compare.compare(new Date(234324), null)).toEqual(1);
    var date = new Date(2423);
    expect(foam.compare.compare(date, date)).toEqual(0);
  });

  // TODO: fix time zone 
  // it('correctly generates relative strings', function() {
  //   var baseDate = new Date(99999);
  //   var d =        new Date(99999);
  //
  //   jasmine.clock().mockDate(baseDate);
  //
  //   expect(foam.date.relativeDateString(d)).toEqual('moments ago');
  //   jasmine.clock().tick(1000);
  //   expect(foam.date.relativeDateString(d)).toEqual('moments ago');
  //
  //   jasmine.clock().tick(60000);
  //   expect(foam.date.relativeDateString(d)).toEqual('1 minute ago');
  //
  //   jasmine.clock().tick(60000);
  //   expect(foam.date.relativeDateString(d)).toEqual('2 minutes ago');
  //
  //   jasmine.clock().tick(60000*60);
  //   expect(foam.date.relativeDateString(d)).toEqual('1 hour ago');
  //
  //   jasmine.clock().tick(60000*60);
  //   expect(foam.date.relativeDateString(d)).toEqual('2 hours ago');
  //
  //   jasmine.clock().tick(60000*60*24);
  //   expect(foam.date.relativeDateString(d)).toEqual('1 day ago');
  //
  //   jasmine.clock().tick(60000*60*24);
  //   expect(foam.date.relativeDateString(d)).toEqual('2 days ago');
  //
  //   jasmine.clock().tick(60000*60*24*7);
  //   expect(foam.date.relativeDateString(d)).toEqual('Dec 31');
  //
  //   jasmine.clock().tick(60000*60*24*365);
  //   expect(foam.date.relativeDateString(d)).toEqual('Dec 31 1969');
  // });
});
