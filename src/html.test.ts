// tslint:disable:max-line-length
import {assert} from "chai";
import {Annotation} from "./annotation";
import {renderToString} from "./html";

describe("renderToString", () => {

  it("Returns text directly with no annotations", () => {
    assert.equal(renderToString("Foo", [], {autoParagraph: false}), "Foo");
  });

  it("Returns auto-generated paragraph breaks by default", () => {
    assert.equal(renderToString("Foo\nBar", []),
`<p class="sharpie-annotation sharpie-type-markup sharpie-id-0 auto-para-break" data-sharpie-position="0" data-sharpie-warp="1">Foo</p><p class="sharpie-annotation sharpie-type-markup sharpie-id-1 auto-para-break" data-sharpie-position="3" data-sharpie-warp="1">
Bar</p>`);
  });

  it("Returns custom markup annotations", () => {
    const atns: Annotation[] = [
      {start: 1, end: 5, type: "markup", format: {color: "blue"}},
    ];
    assert.equal(renderToString("Testing annotation", atns, {autoParagraph: false}),
`T<span style="color: blue;" class="sharpie-annotation sharpie-type-markup sharpie-id-0" data-sharpie-position="1" data-sharpie-warp="1">esti</span>ng annotation`);
  });

  it("Correctly closes and reopens overlapping markup annotations", () => {
    const atns: Annotation[] = [
      {start: 1, end: 5, type: "markup", format: {color: "blue"}},
      {start: 3, end: 9, type: "markup", format: {bgColor: "green"}},
    ];
    assert.equal(renderToString("Testing annotation", atns, {autoParagraph: false}),
`T<span style="color: blue;" class="sharpie-annotation sharpie-type-markup sharpie-id-0" data-sharpie-position="1" data-sharpie-warp="1">es<span style="background-color: green;" class="sharpie-annotation sharpie-type-markup sharpie-id-1" data-sharpie-position="3" data-sharpie-warp="1">ti</span></span><span style="background-color: green;" class="sharpie-annotation sharpie-type-markup sharpie-id-1" data-sharpie-position="5" data-sharpie-warp="1">ng a</span>nnotation`);
  });

  it("Handles complicated stacks of overlapping and autogenerated markup annotations", () => {
    const atns: Annotation[] = [
      {start: 1, end: 10, type: "markup", format: {color: "blue"}},
      {start: 5, end: 6, type: "markup", meta: {htmlTagName: "em"}},
      {start: 5, end: 15, type: "markup", format: {bgColor: "green"}},
      {start: 3, end: 25, type: "markup", format: {opacity: 0.5}},
      {start: 14, end: 25, type: "markup", meta: {htmlTagName: "strong", htmlClassName: "test"}},
    ];
    const str = `This test checks that

the renderer can handle
complicated

stacks of custom annotations and auto-generated

paragraph annotations.`;

    assert.equal(renderToString(str, atns),
`<p class="sharpie-annotation sharpie-type-markup sharpie-id-0 auto-para-break" data-sharpie-position="0" data-sharpie-warp="1">T<span style="color: blue;" class="sharpie-annotation sharpie-type-markup sharpie-id-1" data-sharpie-position="1" data-sharpie-warp="1">hi<span style="opacity: 0.5;" class="sharpie-annotation sharpie-type-markup sharpie-id-2" data-sharpie-position="3" data-sharpie-warp="1">s <span style="background-color: green;" class="sharpie-annotation sharpie-type-markup sharpie-id-3" data-sharpie-position="5" data-sharpie-warp="1"><em class="sharpie-annotation sharpie-type-markup sharpie-id-4" data-sharpie-position="5" data-sharpie-warp="1">t</em>est </span></span></span><span style="opacity: 0.5;" class="sharpie-annotation sharpie-type-markup sharpie-id-2" data-sharpie-position="10" data-sharpie-warp="1"><span style="background-color: green;" class="sharpie-annotation sharpie-type-markup sharpie-id-3" data-sharpie-position="10" data-sharpie-warp="1">chec<strong class="sharpie-annotation sharpie-type-markup sharpie-id-5 test" data-sharpie-position="14" data-sharpie-warp="1">k</strong></span><strong class="sharpie-annotation sharpie-type-markup sharpie-id-5 test" data-sharpie-position="15" data-sharpie-warp="1">s that</strong></span></p><p class="sharpie-annotation sharpie-type-markup sharpie-id-6 auto-para-break" data-sharpie-position="21" data-sharpie-warp="1"><span style="opacity: 0.5;" class="sharpie-annotation sharpie-type-markup sharpie-id-2" data-sharpie-position="21" data-sharpie-warp="1"><strong class="sharpie-annotation sharpie-type-markup sharpie-id-5 test" data-sharpie-position="21" data-sharpie-warp="1">
</strong></span></p><p class="sharpie-annotation sharpie-type-markup sharpie-id-7 auto-para-break" data-sharpie-position="22" data-sharpie-warp="1"><span style="opacity: 0.5;" class="sharpie-annotation sharpie-type-markup sharpie-id-2" data-sharpie-position="22" data-sharpie-warp="1"><strong class="sharpie-annotation sharpie-type-markup sharpie-id-5 test" data-sharpie-position="22" data-sharpie-warp="1">
th</strong></span>e renderer can handle</p><p class="sharpie-annotation sharpie-type-markup sharpie-id-8 auto-para-break" data-sharpie-position="46" data-sharpie-warp="1">
complicated</p><p class="sharpie-annotation sharpie-type-markup sharpie-id-9 auto-para-break" data-sharpie-position="58" data-sharpie-warp="1">
</p><p class="sharpie-annotation sharpie-type-markup sharpie-id-10 auto-para-break" data-sharpie-position="59" data-sharpie-warp="1">
stacks of custom annotations and auto-generated</p><p class="sharpie-annotation sharpie-type-markup sharpie-id-11 auto-para-break" data-sharpie-position="107" data-sharpie-warp="1">
</p><p class="sharpie-annotation sharpie-type-markup sharpie-id-12 auto-para-break" data-sharpie-position="108" data-sharpie-warp="1">
paragraph annotations.</p>`);
  });

  it("Handles directly overlapping ranges without reopening tags", () => {
    const atns: Annotation[] = [
      {start: 0, end: 6, type: "markup", meta: {htmlTagName: "h1"}},
      {start: 0, end: 6, type: "highlight"},
    ];
    const str = `Header

Some other text`;
    assert.equal(renderToString(str, atns),
`<p class="sharpie-annotation sharpie-type-markup sharpie-id-0 auto-para-break" data-sharpie-position="0" data-sharpie-warp="1"><span style="background-color: #fffa129c;" class="sharpie-annotation sharpie-type-highlight sharpie-id-1" data-sharpie-position="0" data-sharpie-warp="1"><h1 class="sharpie-annotation sharpie-type-markup sharpie-id-2" data-sharpie-position="0" data-sharpie-warp="1">Header</h1></span></p><p class="sharpie-annotation sharpie-type-markup sharpie-id-3 auto-para-break" data-sharpie-position="6" data-sharpie-warp="1">
</p><p class="sharpie-annotation sharpie-type-markup sharpie-id-4 auto-para-break" data-sharpie-position="7" data-sharpie-warp="1">
Some other text</p>`);
  });

});
