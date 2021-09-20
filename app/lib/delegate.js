export default function delegate(computed, to, attrs) {
  let delegations = {};

  attrs.forEach(function (d) {
    delegations[d] = computed(`${to}.${d}`);
  });

  return delegations;
}
