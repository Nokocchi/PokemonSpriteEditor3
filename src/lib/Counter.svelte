<script lang="ts">
    import Test from "./Test.svelte";
    let count:number = 1;

    function increment(){
    if(count < 250){
      count++;
    } else {
      count = 1;
    }
}

    function decrement(){
      if(count > 1){
      count--;
    } else {
      count = 251;
    }
}

</script>

<Test pkmnNum={count}/>
<div>
<button on:click={decrement}>
  Click here to cycle backwards pokemons! 
</button>
<button on:click={increment}>
  Click here to cycle forwards pokemons! 
</button>
</div>

<style>
  .flexthing {
    display: flex;
    flex-direction: column;
  }
</style>