export function distribution(submitters, bounty) {
  console.log("Generating distribution list...");
  const distributionList = {};
  const approvedSubmitters = submitters.filter((submitter) => submitter.votes > 0);

  if (approvedSubmitters.length === 0) {
    console.warn("No approved submitters for distribution. Setting rewards to 0.");
    approvedSubmitters.forEach((submitter) => {
      distributionList[submitter.publicKey] = 0; // Log zero rewards explicitly.
    });
    return distributionList;
  }

  const reward = Math.floor(bounty / approvedSubmitters.length);
  approvedSubmitters.forEach((submitter) => {
    distributionList[submitter.publicKey] = reward;
  });

  console.log("Final distribution list:", distributionList);
  return distributionList;
}
