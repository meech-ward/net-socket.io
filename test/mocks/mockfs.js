module.exports = {
  reset() {
    this.unlinks = [];
  },
  unlinks: [],
  unlinkSync(path) {
    this.unlinks.push(path);
  }
}