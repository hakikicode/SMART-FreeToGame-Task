export function distribution(submitters, bounty) {
  const distributionList = {};
  const approvedSubmitters = submitters.filter((submitter) => submitter.votes > 0);

  if (approvedSubmitters.length === 0) {
    console.warn("No approved submitters for distribution.");
    return distributionList;
  }

  // Calculate reward per approved submitter
  const reward = Math.floor(bounty / approvedSubmitters.length);

  // Distribute the bounty
  approvedSubmitters.forEach((submitter) => {
    distributionList[submitter.publicKey] = reward;
  });

  console.log("Final distribution list:", distributionList);
  return distributionList;
}
