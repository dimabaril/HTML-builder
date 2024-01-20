let a = 5;

function foo() {
  return new Promise((resolve) => {
    setTimeout(() => {
      a = 10;
      resolve('hui');
    }, 2000);
  });
}

async function main() {
  await foo().then((res) => console.log(res));
  console.log(a);
}

main();
