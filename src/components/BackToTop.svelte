<a href="#top" class="back-to-top">トップへ戻る</a>

<style>
  .back-to-top {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    padding: 0.5rem 1rem;
    background-color: #000;
    color: #fff;
    text-decoration: none;
    border-radius: 0.25rem;
    z-index: 100;
    opacity: 0;
    transition: display 1s;
    animation: fadeAnim linear forwards;
    animation-timeline: scroll();
    animation-range: contain 100lvh contain calc(100lvh + 10rem);
    transition-behavior: allow-discrete;
    view-transition-name: back-to-top;

    @starting-style {
      display: none;
    }
  }

  .back-to-top:hover {
    background-color: #666;
  }

  @keyframes fadeAnim {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>
