import mayadate from '@drewsonne/maya-dates';
import Operator from '../src/parser/tokens/operator';
import CommentCollapser from '../src/parser/collapser/comment';
import Line from '../src/parser/complex-tokens/line';
import Comment from '../src/parser/complex-tokens/comment';

expect.extend({
  toBeLC(received, expectedLC) {
    const pass = received.equal(expectedLC);
    return {
      message: () => `expected ${received} ${pass ? 'not' : ''} to be the same as ${expectedLC}`,
      pass
    };
  }
});


describe('comment-collapser', () => {
  const LC = mayadate.lc.LongCount;
  // const parsedInput = [
  //   [
  //
  //     [
  //       new Line(
  //         new Operator('+'),
  //         new LongCount(
  //           new mayadate.lc.LongCount(1, 1, 2, 2)
  //         ).setComment('Hallo World')
  //       )
  //     ],
  //   ]
  // ];

  const lines1 = [
    new Line(
      new LC(1, 1, 1, 1,),
      new Operator('+'),
      new Comment('Hallo World'),
      new LC(1, 1, 1, 1,)
    ),
    new Line(
      new LC(1, 1)
    )
  ];

  const expected1 = [
    new Line(
      new LC(1, 1, 1, 1,),
      new Operator('+').setComment('Hallo World  0. 1. 1. 1. 1'),
    ),
    new Line(
      new LC(1, 1)
    )
  ];

  it(`${lines1} -> ${expected1}`, () => {
    const newLines = new CommentCollapser(lines1).run();
    expect(newLines[0]).toBeLC(expected1[0]);
  });
});
